import { Glyph } from '@/components/glyphs/Glyph';
import { SmartMedia } from '@/components/ui/SmartMedia';
import { cn } from '@/lib/cn';
import type { ChannelLite } from '@/lib/types';

type Props = { channel: Pick<ChannelLite, 'slug' | 'order' | 'name' | 'shortName' | 'category' | 'glyph' | 'posterStyle' | 'card'>; className?: string; sizes?: string; priority?: boolean };

const idx = (n: number) => `(${String(n).padStart(2, '0')})`;

/**
 * Mini motion poster for a channel. Three styles rotate through the set:
 * photo-duotone, type-poster and glyph-poster (BRIEF §7.2).
 */
export function PosterCard({ channel: c, className, sizes = '320px', priority }: Props) {
  const base = 'poster relative flex aspect-[3/4] w-full flex-col justify-between overflow-hidden rounded-[22px] p-[7%] select-none';
  const meta = (
    <div className="mono relative z-10 flex items-center justify-between !text-[10px]">
      <span>{idx(c.order)}</span>
      <span>{c.category}</span>
    </div>
  );
  const name = (
    <span className="display relative z-10 block text-[clamp(1.05rem,1.9vw,1.7rem)] font-semibold leading-[0.95]" style={{ containerType: 'normal' }}>
      {c.shortName}
    </span>
  );

  if (c.posterStyle === 'photo-duotone') {
    return (
      <div className={cn(base, 'bg-ink text-white', className)}>
        <SmartMedia media={c.card} glyph={c.glyph} duotone className="!absolute inset-0" sizes={sizes} maxWidth={800} priority={priority} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25" aria-hidden />
        {meta}
        {name}
      </div>
    );
  }
  if (c.posterStyle === 'type-poster') {
    // Motion poster: rings ripple outward like a broadcast signal, with the channel's animated glyph at the centre.
    return (
      <div className={cn(base, 'bg-cream text-ink', className)}>
        <div className="tp-rings" aria-hidden>
          {[0, 1, 2, 3].map((k) => (
            <span key={k} className="tp-ring" style={{ ['--k' as string]: k }} />
          ))}
          <span className="tp-core">
            <Glyph id={c.glyph} tone="brand" />
          </span>
        </div>
        {meta}
        <span
          className="display relative z-10 block font-bold leading-[0.88] tracking-[-0.045em]"
          // Long names step down so words never break mid-way.
          style={{ fontSize: c.shortName.length > 10 ? 'clamp(1rem, 1.7vw, 1.65rem)' : c.shortName.length > 7 ? 'clamp(1.15rem, 2vw, 1.95rem)' : 'clamp(1.4rem, 2.6vw, 2.4rem)' }}
        >
          {c.shortName}
        </span>
      </div>
    );
  }
  const onBrand = c.order % 2 === 0;
  return (
    <div className={cn(base, onBrand ? 'bg-brand text-on-brand' : 'bg-ink text-cream', className)}>
      {meta}
      <div className="absolute inset-x-[12%] top-[16%] aspect-square">
        <Glyph id={c.glyph} tone={onBrand ? 'brand' : 'ink'} />
      </div>
      {name}
    </div>
  );
}
