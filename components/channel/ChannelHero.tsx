import { Glyph } from '@/components/glyphs/Glyph';
import { TLink } from '@/components/providers/Transition';
import { ArrowUpRight } from '@/components/ui/Icons';
import { SmartMedia } from '@/components/ui/SmartMedia';
import { SplitHeading } from '@/components/ui/SplitHeading';
import { categoryTitle } from '@/data/categories';
import type { ChannelData } from '@/lib/types';

/** Full-bleed photo with an orange duotone, mono index, split H1 and the channel glyph large in the corner. */
export function ChannelHero({ channel: c }: { channel: ChannelData }) {
  return (
    <section className="on-dark relative isolate flex min-h-[86vh] items-end overflow-hidden bg-ink text-paper">
      <SmartMedia media={c.media.hero} video={c.media.video} glyph={c.glyph} duotone priority kenBurns className="!absolute inset-0 -z-10" sizes="100vw" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/30 to-black/40" aria-hidden />
      <div className="pointer-events-none absolute right-[4%] top-[calc(var(--nav-h)+24px)] hidden size-[clamp(160px,22vw,320px)] rounded-[32px] bg-white/10 p-6 backdrop-blur-md md:block">
        <Glyph id={c.glyph} tone="ink" />
      </div>
      <div className="wrap relative pb-[clamp(48px,7vw,96px)] pt-[calc(var(--nav-h)+120px)]">
        <nav aria-label="Breadcrumb" className="mono mb-6 text-white/70">
          <TLink href="/channels" className="hover:text-white">
            Channels
          </TLink>{' '}
          / ({String(c.order).padStart(2, '0')}) {categoryTitle(c.category)}
        </nav>
        <SplitHeading as="h1" immediate className="t-hero max-w-[13ch] font-semibold">
          {c.name}
        </SplitHeading>
        <p className="mt-6 max-w-[48ch] text-[clamp(1.1rem,1.6vw,1.4rem)] leading-snug text-white/85">{c.tagline}</p>
        <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed text-white/70">{c.summary}</p>
        <TLink href={`/planner?mode=budget&include=${c.slug}`} className="btn btn-brand mt-8">
          Plan with {c.shortName.toLowerCase()} <ArrowUpRight size={18} />
        </TLink>
      </div>
    </section>
  );
}
