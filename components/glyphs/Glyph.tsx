'use client';

import { useEffect, useRef, type ComponentType } from 'react';
import { GLYPH_IDS, type GlyphId } from '@/lib/types';
import { Svg, K, A } from './base';
import { CinemaGlyph, PrintGlyph, RadioGlyph, TvGlyph } from './art-mass';
import { BusAutoGlyph, DoohGlyph, HoardingsGlyph, InsideMetroGlyph, MetroWrapGlyph } from './art-outdoor';
import { AirlineGlyph, AirportGlyph, RailwaysGlyph, StadiumGlyph } from './art-travel';
import { AmbassadorGlyph, DigitalPrGlyph, InfluencerGlyph, SearchGlyph, SocialGlyph } from './art-digital';
import { DataChartGlyph, IndiaPinGlyph, LostSignalGlyph, ReceiptGlyph } from './art-extra';

export type ExtraGlyphId = 'data-chart' | 'india-pin' | 'receipt' | 'lost-signal';
export type AnyGlyphId = GlyphId | ExtraGlyphId;
export type GlyphTone = 'light' | 'ink' | 'brand';

export const EXTRA_GLYPH_IDS: ExtraGlyphId[] = ['data-chart', 'india-pin', 'receipt', 'lost-signal'];
export const ALL_GLYPH_IDS: AnyGlyphId[] = [...GLYPH_IDS, ...EXTRA_GLYPH_IDS];

export type GlyphProps = {
  id: AnyGlyphId;
  /** Pixel size. Omit to fill the parent (width and height 100%). */
  size?: number;
  tone?: GlyphTone;
  className?: string;
  /** Force the static frame (no animation). */
  paused?: boolean;
  /** Accessible name. Without it the glyph is decorative (aria-hidden). */
  title?: string;
};

const ART: Record<AnyGlyphId, ComponentType> = {
  print: PrintGlyph,
  tv: TvGlyph,
  radio: RadioGlyph,
  cinema: CinemaGlyph,
  hoardings: HoardingsGlyph,
  dooh: DoohGlyph,
  'bus-auto': BusAutoGlyph,
  'metro-wrap': MetroWrapGlyph,
  'inside-metro': InsideMetroGlyph,
  railways: RailwaysGlyph,
  airport: AirportGlyph,
  airline: AirlineGlyph,
  stadium: StadiumGlyph,
  ambassador: AmbassadorGlyph,
  influencer: InfluencerGlyph,
  social: SocialGlyph,
  search: SearchGlyph,
  'digital-pr': DigitalPrGlyph,
  'data-chart': DataChartGlyph,
  'india-pin': IndiaPinGlyph,
  receipt: ReceiptGlyph,
  'lost-signal': LostSignalGlyph,
};

/** Neutral mark for unknown ids: never throw on bad data. */
function FallbackGlyph() {
  return (
    <Svg id="fallback">
      <circle cx="60" cy="60" r="36" />
      <circle className="g-fallback-dot g-o-c" cx="60" cy="60" r="12" fill={A} stroke="none" />
      <path d="M60 14V6M60 114V106M14 60H6M114 60H106" stroke={K} />
    </Svg>
  );
}

export function Glyph({ id, size, tone = 'light', className, paused = false, title }: GlyphProps) {
  const ref = useRef<HTMLSpanElement>(null);

  // One observer per instance: freeze the loop while the glyph is off-screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (paused) {
      el.dataset.paused = 'true';
      return;
    }
    if (typeof IntersectionObserver === 'undefined') {
      el.dataset.paused = 'false';
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (entry) el.dataset.paused = entry.isIntersecting ? 'false' : 'true';
      },
      { rootMargin: '80px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [paused]);

  const Art = Object.prototype.hasOwnProperty.call(ART, id) ? ART[id] : FallbackGlyph;
  const dim = size != null ? `${size}px` : '100%';

  return (
    <span
      ref={ref}
      className={className ? `glyph ${className}` : 'glyph'}
      data-glyph={id}
      data-tone={tone}
      data-paused={paused ? 'true' : 'false'}
      data-static={paused ? 'true' : undefined}
      style={{ width: dim, height: dim }}
      role={title ? 'img' : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
    >
      <Art />
    </span>
  );
}
