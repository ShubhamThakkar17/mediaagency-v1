import type { AudienceId } from '@/data/audiences';
import type { CategoryId } from '@/data/categories';
import type { IndustryId } from '@/data/industries';
import type { ObjectiveId } from '@/data/objectives';
import type { ZoneId } from '@/data/regions';

export type Level = 1 | 2 | 3 | 4 | 5;

export const GLYPH_IDS = [
  'print',
  'tv',
  'radio',
  'cinema',
  'hoardings',
  'dooh',
  'bus-auto',
  'metro-wrap',
  'inside-metro',
  'railways',
  'airport',
  'airline',
  'stadium',
  'ambassador',
  'influencer',
  'social',
  'search',
  'digital-pr',
] as const;
export type GlyphId = (typeof GLYPH_IDS)[number];

export const POSTER_STYLES = ['photo-duotone', 'type-poster', 'glyph-poster'] as const;
export type PosterStyle = (typeof POSTER_STYLES)[number];

export type Licence = 'Unsplash' | 'Pexels' | 'Own' | 'Generated';

export type MediaRef = {
  /** Empty string means "no asset yet": SmartMedia renders the branded fallback. */
  src: string;
  alt: string;
  credit: string;
  creditUrl: string;
  licence: Licence;
};

export type SourceRef = { publisher: string; report: string; year: number; url: string };

export type ChannelData = {
  slug: string;
  order: number;
  name: string;
  shortName: string;
  category: CategoryId;
  tagline: string;
  glyph: GlyphId;
  posterStyle: PosterStyle;
  media: { hero: MediaRef; card: MediaRef; video?: MediaRef };
  formats: { name: string; icon: string }[];
  funnel: { awareness: Level; consideration: Level; conversion: Level; loyalty: Level };
  audienceAffinity: Record<AudienceId, Level>;
  zoneStrength: Record<ZoneId, Level>;
  tierStrength: { metro: number; tier1: number; tier2: number; tier3Rural: number };
  industryFit: Record<IndustryId, Level>;
  objectiveFit: Record<ObjectiveId, Level>;
  costs: {
    unitLabel: string;
    cpm: { low: number; high: number };
    minMonthlyINR: number;
    leadTimeDays: number;
    /** Optional note shown next to the range, e.g. "CPC ₹10–60". */
    note?: string;
    verified: false;
  };
  roleKpi: string;
  market?: { label: string; value: string; source: SourceRef };
  faqs: { q: string; a: string }[];
  related: string[];
  /** Extras beyond the brief's schema. */
  summary: string;
  bestFor: string[];
  /** MDX body (long-form copy), rendered on the channel page. */
  body: string;
};

/** The slice of a channel that client components and the planner need. */
export type ChannelLite = Pick<
  ChannelData,
  | 'slug'
  | 'order'
  | 'name'
  | 'shortName'
  | 'category'
  | 'tagline'
  | 'glyph'
  | 'posterStyle'
  | 'funnel'
  | 'audienceAffinity'
  | 'zoneStrength'
  | 'tierStrength'
  | 'industryFit'
  | 'objectiveFit'
  | 'costs'
  | 'roleKpi'
> & { card: MediaRef };
