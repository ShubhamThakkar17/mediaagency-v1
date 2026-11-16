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
  // Trade coverage quoting the report's ADEX table (checked during the build run).
  url: 'https://www.socialsamosa.com/report/digital-sixty-percent-indias-ad-market-pitch-madison-advertising-report-11125052',
};

const wppSportingNation: SourceRef = {
  publisher: 'WPP Media',
  report: 'Sporting Nation: India sports economy report (2025 data, released 2026)',
  year: 2026,
  url: 'https://www.wppmedia.com/news/sporting-nation-india-sports-sponsorship-report-2025',
};

const kofluence: SourceRef = {
  publisher: 'Kofluence',
  report: 'Decoding Influence: Annual Research Report 2026',
  year: 2026,
  url: 'https://www.campaignindia.in/article/kofluence-report-tracks-creator-economy-s-formal-shift/4xrn0g9cve1s8tcd4m0revck5k',
};

export const MARKET_FIGURES: MarketFigure[] = [
  {
    id: 'adex-2025',
    label: 'India ad spend, 2025',
    value: '₹1,55,105 crore',
    note: 'about +12% vs 2024, expanded ADEX definition',
    channels: [],
    source: pitchMadison,
    verified: true,
  },
  {
    id: 'adex-2026',
    label: 'India ad spend, 2026 forecast',
    value: '₹1,74,605 crore',
    note: 'forecast, expanded ADEX definition',
    channels: [],
    source: pitchMadison,
    verified: true,
  },
  {
    id: 'digital-share-2026',
    label: 'Digital share of ad spend, 2026 forecast',
    value: 'about 64%',
    note: 'forecast, about ₹1,11,976 crore',
    channels: ['social-media', 'search-performance'],
    source: pitchMadison,
    verified: true,
  },
  {
    id: 'tv-2025',
    label: 'Television ad spend, 2025',
    value: '₹32,855 crore',
    note: 'linear TV, about 5% lower than 2024',
    channels: ['television'],
    source: pitchMadison,
    verified: true,
  },
  {
    id: 'print-2025',
    label: 'Print ad spend, 2025',
    value: '₹20,866 crore',
    channels: ['print'],
    source: pitchMadison,
    verified: true,
  },
  {
    id: 'outdoor-2025',
    label: 'Outdoor ad spend, 2025',
    value: '₹4,835 crore',
    channels: ['hoardings', 'digital-ooh'],
    source: pitchMadison,
    verified: true,
  },
  {
    id: 'radio-2025',
    label: 'Radio ad spend, 2025',
    value: '₹2,515 crore',
    channels: ['radio'],
    source: pitchMadison,
    verified: true,
  },
  {
    id: 'cinema-2025',
    label: 'Cinema ad spend, 2025',
    value: '₹877 crore',
    channels: ['cinema'],
    source: pitchMadison,
    verified: true,
  },
  {
    id: 'sports-2025',
    label: 'India sports economy, 2025',
    value: '₹18,864 crore',
    note: 'sponsorship, endorsement and media spends. Cricket about 89%',
    channels: ['stadiums-sports'],
    source: wppSportingNation,
    verified: true,
  },
  {
    id: 'influencer-2025',
    label: 'Influencer marketing, 2025',
    value: '₹3,000 to 3,500 crore',
    note: 'publisher estimate',
    channels: ['influencers'],
    source: kofluence,
    verified: true,
  },
];

export const marketFigure = (id: string) => MARKET_FIGURES.find((f) => f.id === id);
export const marketFiguresFor = (slug: string) => MARKET_FIGURES.filter((f) => f.channels.includes(slug));
