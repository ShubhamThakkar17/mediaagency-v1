/** Motion tokens shared by GSAP, Motion and CSS (mirrored in globals.css). */
export const ease = {
  outExpo: [0.16, 1, 0.3, 1] as [number, number, number, number],
  inOutQuart: [0.76, 0, 0.24, 1] as [number, number, number, number],
} as const;

/** GSAP ease strings (CustomEase is not needed: these are near-identical built-ins). */
export const gsapEase = { outExpo: 'expo.out', inOutQuart: 'quart.inOut', out: 'power3.out' } as const;

export const duration = { fast: 0.4, base: 0.8, slow: 1.2 } as const;

export const spring = {
  soft: { type: 'spring', stiffness: 120, damping: 20, mass: 1 },
  snappy: { type: 'spring', stiffness: 320, damping: 30, mass: 0.8 },
  bouncy: { type: 'spring', stiffness: 260, damping: 16, mass: 0.9 },
} as const;

export const stagger = { lines: 0.06, items: 0.08 } as const;

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION_QUERY).matches;
}
