'use client';
// STUB: replaced by the glyph library (M4). Keeps the public API stable.
import type { GlyphId } from '@/lib/types';

export type ExtraGlyphId = 'data-chart' | 'india-pin' | 'receipt' | 'lost-signal';
export type AnyGlyphId = GlyphId | ExtraGlyphId;
export type GlyphTone = 'light' | 'ink' | 'brand';

export type GlyphProps = {
  id: AnyGlyphId;
  /** Pixel size. Omit to fill the parent (width and height 100%). */
  size?: number;
  tone?: GlyphTone;
  className?: string;
  /** Force the static frame. */
  paused?: boolean;
  title?: string;
};

export function Glyph({ id, size, tone = 'light', className, title }: GlyphProps) {
  return (
    <span
      className={className}
      data-glyph={id}
      data-tone={tone}
      style={{ display: 'inline-block', width: size ?? '100%', height: size ?? '100%' }}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <svg viewBox="0 0 120 120" width="100%" height="100%">
        <circle cx="60" cy="60" r="34" fill="none" stroke="currentColor" strokeWidth="4" />
        <circle cx="60" cy="60" r="10" fill="var(--brand)" />
      </svg>
    </span>
  );
}
