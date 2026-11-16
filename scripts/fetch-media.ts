/**
 * Suggest stock media for EMPTY slots in content/media.ts (BRIEF §8.2).
 *
 *   UNSPLASH_ACCESS_KEY=... PEXELS_API_KEY=... pnpm fetch:media
 *   pnpm fetch:media -- --per-slot 5        # more candidates per slot
 *   pnpm fetch:media -- --only ind-retail   # one slot
 *
 * Uses only the official search APIs, with each slot's `brief` as the query,
 * and prints candidate entries as JSON for human review. It never edits
 * media.ts: copy the entries you approve into the registry by hand, check
 * them against the rules there (no brands, logos, celebrities or staff
 * faces), then run `pnpm check:media`.
 */
import { MEDIA, type MediaAsset } from '../content/media';

type Candidate = {
  slot: string;
  provider: 'unsplash' | 'pexels';
  kind: 'image' | 'video';
  src: string;
  poster?: string;
  alt: string;
  credit: string;
  creditUrl: string;
  sourcePage: string;
  licence: 'Unsplash' | 'Pexels';
  width?: number;
  height?: number;
};

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY?.trim();
const PEXELS_KEY = process.env.PEXELS_API_KEY?.trim();

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const PER_SLOT = Math.max(1, Math.min(10, Number(arg('--per-slot') ?? 3) || 3));
const ONLY = arg('--only');

async function getJson(url: string, headers: Record<string, string>): Promise<unknown> {
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(20_000) });
  if (!res.ok) throw new Error(`${new URL(url).hostname} answered HTTP ${res.status}`);
  return res.json();
}

/* ----------------------------- Unsplash ------------------------------ */

type UnsplashPhoto = {
  id: string;
  width: number;
  height: number;
  alt_description: string | null;
  description: string | null;
  premium?: boolean;
  plus?: boolean;
  urls: { raw: string };
  links: { html: string };
  user: { name: string; links: { html: string } };
};

async function searchUnsplash(slot: MediaAsset): Promise<Candidate[]> {
  if (!UNSPLASH_KEY || slot.kind !== 'image') return [];
  const orientation = slot.id === 'about-portrait' ? 'portrait' : 'landscape';
  const q = new URLSearchParams({
    query: slot.brief,
    per_page: String(PER_SLOT),
    orientation,
    content_filter: 'high',
  });
  const data = (await getJson(`https://api.unsplash.com/search/photos?${q}`, {
    Authorization: `Client-ID ${UNSPLASH_KEY}`,
    'Accept-Version': 'v1',
  })) as { results: UnsplashPhoto[] };

  return data.results
    .filter((p) => !p.premium && !p.plus && p.urls.raw.startsWith('https://images.unsplash.com/'))
    .map((p) => ({
      slot: slot.id,
      provider: 'unsplash' as const,
      kind: 'image' as const,
      // The site adds its own sizing params, so store the bare URL.
      src: p.urls.raw.split('?')[0],
      alt: p.alt_description ?? p.description ?? slot.brief,
      credit: p.user.name,
      creditUrl: p.user.links.html,
      sourcePage: p.links.html,
      licence: 'Unsplash' as const,
      width: p.width,
      height: p.height,
    }));
}

/* ------------------------------ Pexels ------------------------------- */

type PexelsPhoto = {
  width: number;
  height: number;
  url: string;
  alt: string;
  photographer: string;
  photographer_url: string;
  src: { original: string };
};

type PexelsVideo = {
  width: number;
  height: number;
  url: string;
  image: string;
  user: { name: string; url: string };
  video_files: { link: string; file_type: string; width: number | null; quality: string | null }[];
};

async function searchPexels(slot: MediaAsset): Promise<Candidate[]> {
  if (!PEXELS_KEY) return [];
  const orientation = slot.id === 'about-portrait' ? 'portrait' : 'landscape';
  const q = new URLSearchParams({ query: slot.brief, per_page: String(PER_SLOT), orientation });
  const headers = { Authorization: PEXELS_KEY };

  if (slot.kind === 'video') {
    const data = (await getJson(`https://api.pexels.com/videos/search?${q}`, headers)) as {
      videos: PexelsVideo[];
    };
    return data.videos.flatMap((v) => {
      // Prefer an HD mp4 no wider than 1920px: big enough, not wasteful.
      const file = v.video_files
        .filter((f) => f.file_type === 'video/mp4' && (f.width ?? 0) <= 1920)
        .sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0];
      if (!file) return [];
      return [
        {
          slot: slot.id,
          provider: 'pexels' as const,
          kind: 'video' as const,
          src: file.link,
          poster: v.image,
          alt: slot.brief,
          credit: v.user.name,
          creditUrl: v.user.url,
          sourcePage: v.url,
          licence: 'Pexels' as const,
          width: v.width,
          height: v.height,
        },
      ];
    });
  }

  const data = (await getJson(`https://api.pexels.com/v1/search?${q}`, headers)) as { photos: PexelsPhoto[] };
  return data.photos.map((p) => ({
    slot: slot.id,
    provider: 'pexels' as const,
    kind: 'image' as const,
    src: p.src.original.split('?')[0],
    alt: p.alt || slot.brief,
    credit: p.photographer,
    creditUrl: p.photographer_url,
    sourcePage: p.url,
    licence: 'Pexels' as const,
    width: p.width,
    height: p.height,
  }));
}

/* ------------------------------- Main -------------------------------- */

async function main(): Promise<void> {
  if (!UNSPLASH_KEY && !PEXELS_KEY) {
    console.log(
      'fetch:media: no UNSPLASH_ACCESS_KEY or PEXELS_API_KEY set, so there is nothing to query.\n' +
        'Set one or both (see .env.example) and run again. Empty slots keep the branded fallback meanwhile.',
    );
    return;
  }

  const slots = MEDIA.filter((m) => !m.src && (!ONLY || m.id === ONLY));
  if (slots.length === 0) {
    console.log(ONLY ? `fetch:media: slot "${ONLY}" is not empty or does not exist.` : 'fetch:media: every slot is filled.');
    return;
  }

  const providers = [UNSPLASH_KEY && 'Unsplash', PEXELS_KEY && 'Pexels'].filter(Boolean).join(' + ');
  console.error(`fetch:media: searching ${providers} for ${slots.length} empty slot(s), ${PER_SLOT} per provider...`);

  const out: Record<string, { brief: string; kind: string; candidates: Candidate[]; errors?: string[] }> = {};
  for (const slot of slots) {
    const errors: string[] = [];
    const settled = await Promise.allSettled([searchUnsplash(slot), searchPexels(slot)]);
    const candidates = settled.flatMap((r) => {
      if (r.status === 'fulfilled') return r.value;
      errors.push(r.reason instanceof Error ? r.reason.message : String(r.reason));
      return [];
    });
    out[slot.id] = { brief: slot.brief, kind: slot.kind, candidates, ...(errors.length ? { errors } : {}) };
  }

  console.log(JSON.stringify(out, null, 2));
  console.error(
    'fetch:media: review each candidate by eye before copying it into content/media.ts ' +
      '(no brands, logos, celebrities or staff faces), then run `pnpm check:media`.',
  );
}

main().catch((err: unknown) => {
  console.error('fetch:media failed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
