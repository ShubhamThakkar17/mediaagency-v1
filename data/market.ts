import type { SourceRef } from '@/lib/types';

/**
 * Sourced market figures (BRIEF §11). These are NOT demo content: each one
 * carries its source. `verified: false` means the figure could not be checked
 * against the source during the build run; such figures are hidden when
 * NEXT_PUBLIC_DEMO_MODE=false (see lib/demo-guard.ts `visibleFigures`).
 */
export type MarketFigure = {
  id: string;
  label: string;
  value: string;
  /** Optional qualifier, e.g. "about +12% vs 2024". */
  note?: string;
  /** Channel slugs this figure is relevant to. Empty means market-wide. */
  channels: string[];
  source: SourceRef;
  verified: boolean;
};

const pitchMadison: SourceRef = {
  publisher: 'Pitch Madison',
  report: 'Pitch Madison Advertising Report 2026',
  year: 2026,
  url: 'https://www.madisonindia.com/',
};

// TODO(content): verify each figure against its source and set URLs.
export const MARKET_FIGURES: MarketFigure[] = [
  {
    id: 'adex-2025',
    label: 'India ad spend, 2025',
    value: '₹1,55,105 crore',
    note: 'about +12% vs 2024',
    channels: [],
    source: pitchMadison,
    verified: false,
  },
];

export const marketFigure = (id: string) => MARKET_FIGURES.find((f) => f.id === id);
export const marketFiguresFor = (slug: string) => MARKET_FIGURES.filter((f) => f.channels.includes(slug));
