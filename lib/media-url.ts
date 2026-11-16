/** Sizing params for hot-linked stock CDNs (BRIEF §8.1). */
export function sizedSrc(src: string, width: number, quality = 72): string {
  if (!src) return src;
  try {
    const u = new URL(src);
    if (u.hostname.endsWith('unsplash.com')) {
      u.searchParams.set('w', String(width));
      u.searchParams.set('q', String(quality));
      u.searchParams.set('auto', 'format');
      u.searchParams.set('fit', 'crop');
      return u.toString();
    }
    if (u.hostname === 'images.pexels.com') {
      u.searchParams.set('auto', 'compress');
      u.searchParams.set('cs', 'tinysrgb');
      u.searchParams.set('w', String(width));
      return u.toString();
    }
    return src;
  } catch {
    return src;
  }
}

const WIDTHS = [480, 800, 1200, 1600, 2000];
export function srcSet(src: string, max = 2000): string | undefined {
  if (!/unsplash\.com|pexels\.com/.test(src)) return undefined;
  return WIDTHS.filter((w) => w <= max)
    .map((w) => `${sizedSrc(src, w)} ${w}w`)
    .join(', ');
}
