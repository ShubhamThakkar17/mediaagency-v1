import type { ReactNode } from 'react';

/** Colour tokens. Every themeable colour goes through these CSS variables (see glyphs.css). */
export const K = 'var(--g-ink)';
export const A = 'var(--g-accent)';
export const P = 'var(--g-paper)';
export const S = 'var(--g-soft)';
/** Accent for parts that sit on a paper surface (stays the brand colour on every tone). */
export const POP = 'var(--g-pop)';
/** Tint for parts that sit on a paper surface. */
export const TINT = 'var(--g-tint)';

/** Shared 120 x 120 canvas: chunky ink strokes, rounded caps and joins. */
export function Svg({ id, children }: { id: string; children: ReactNode }) {
  return (
    <svg
      className={`g-svg g-${id}`}
      viewBox="0 0 120 120"
      width="100%"
      height="100%"
      fill="none"
      stroke={K}
      strokeWidth={4.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      {children}
    </svg>
  );
}
