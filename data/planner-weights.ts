/**
 * Every tunable of the Media Planner lives here.
 *
 * All values are PLANNING ASSUMPTIONS for this template, not rate cards and
 * not audited audience data. A media team should review them alongside the
 * channel costs in content/channels/*.mdx and the CPL ranges in
 * data/industries.ts. The engine (lib/planner/engine.ts) reads these values
 * and contains no numbers of its own.
 */
import type { CategoryId } from './categories';
import type { StageId } from './objectives';
import type { TierId, ZoneId } from './regions';
import { STATES } from './regions';

type Level = 1 | 2 | 3 | 4 | 5;

/* ------------------------------------------------------------------ */
/* Scoring                                                             */
/* ------------------------------------------------------------------ */

/**
 * score = industry*industryFit + objective*objectiveFit + stage*stageFit
 *       + region*regionStrength + audience*audienceAffinity
 * Each term is on a 1 to 5 scale, so the score is also 1 to 5. Sums to 1.
 */
export const SCORE_WEIGHTS = {
  industry: 0.3,
  objective: 0.25,
  stage: 0.15,
  region: 0.15,
  audience: 0.15,
} as const;

/** Audience term used when no audience is selected (the middle of the 1 to 5 scale). */
export const NEUTRAL_AUDIENCE_SCORE = 3;

/** regionStrength = zone * avg(zoneStrength) + tier * avg(tierStrength). */
export const REGION_STRENGTH_MIX = { zone: 0.5, tier: 0.5 } as const;

/* ------------------------------------------------------------------ */
/* Mode A: budget -> channels                                          */
/* ------------------------------------------------------------------ */

/** Budget is split in proportion to score^ALLOCATION_EXPONENT. Above 1 rewards the best fits. */
export const ALLOCATION_EXPONENT = 1.5;

/** No single channel takes more than this share of a multi-channel plan. */
export const MAX_SHARE_PCT = 50;

/** For leads and sales objectives, at least this share stays in trackable digital. */
export const MIN_TRACKABLE_DIGITAL_PCT = 10;

/** Channels where every rupee can be tracked to a click, lead or sale. */
export const TRACKABLE_DIGITAL_SLUGS: readonly string[] = ['social-media', 'search-performance'];

/** Channels whose spend converts to leads through the industry CPL range. */
export const PERFORMANCE_SLUGS: readonly string[] = ['social-media', 'search-performance'];

/** Objectives that trigger the trackable-digital floor and lead-led KPI wording. */
export const PERFORMANCE_OBJECTIVES: readonly string[] = ['leads', 'sales'];

/** Sliders and inputs are clamped to this range (₹1 L to ₹10 Cr). */
export const BUDGET_LIMITS = { min: 100000, max: 100000000 } as const;

/** Spends are rounded to this step, and the budget itself is rounded to it first. */
export const SPEND_ROUNDING_INR = 1000;

/**
 * How many channels a budget can carry. `upToINR` is exclusive. Within a band
 * the engine moves from `min` towards `max` as the budget moves through the
 * band (on a log scale), then drops channels that cannot clear their minimum.
 */
export const CHANNEL_COUNT_BY_BUDGET: readonly { upToINR: number; min: number; max: number; label: string }[] = [
  { upToINR: 500000, min: 2, max: 3, label: 'Under ₹5 L' },
  { upToINR: 2500000, min: 3, max: 5, label: '₹5 L to ₹25 L' },
  { upToINR: 10000000, min: 4, max: 7, label: '₹25 L to ₹1 Cr' },
  { upToINR: Infinity, min: 5, max: 9, label: 'Above ₹1 Cr' },
];

/* ------------------------------------------------------------------ */
/* Mode B: channels -> budget                                          */
/* ------------------------------------------------------------------ */

/** Launch is the minimum viable presence. Elevate and Dominate multiply it. */
export const INTENSITY = {
  launch: 1,
  elevate: 2.5,
  dominate: 6,
} as const;

export const INTENSITY_ORDER = ['launch', 'elevate', 'dominate'] as const;

export const INTENSITY_META: Record<keyof typeof INTENSITY, { label: string; blurb: string }> = {
  launch: { label: 'Launch', blurb: 'The minimum viable presence on each channel. Enough to be seen and to test response.' },
  elevate: { label: 'Elevate', blurb: 'Steady weight on every channel. Built for recall and a healthy share of voice.' },
  dominate: { label: 'Dominate', blurb: 'Heavy, hard-to-miss weight. Built to own the category in your markets.' },
};

/** Planning range shown around each scenario total (minus 15%, plus 20%). */
export const SCENARIO_RANGE = { low: 0.85, high: 1.2 } as const;

/**
 * Geographic scaling for Mode B (and for the "thin budget" check in Mode A).
 *
 * A channel's minimum monthly spend is the price of a meaningful presence in
 * ONE city. Covering more ground needs more inventory, but not in a straight
 * line: plans concentrate on key cities, and network deals bring volume
 * rates. So the factor is "effective number of city-sized buys":
 *   - city: 1
 *   - state: about 2.5 (the capital plus two or three key cities)
 *   - zones: 3.5 per zone (five or six key cities, with volume efficiency)
 *   - pan-India: 16 (the ceiling. Five or six zones never cost more than this)
 * Selecting fewer market tiers shrinks the footprint (TIER_BREADTH_FACTOR).
 */
export const CITY_COUNT_FACTOR = {
  city: 1,
  state: 2.5,
  perZone: 3.5,
  panIndia: 16,
} as const;

/** Share of the full footprint bought when only some of the four tiers are in play. Not used for a single city. */
export const TIER_BREADTH_FACTOR: Record<1 | 2 | 3 | 4, number> = { 1: 0.6, 2: 0.8, 3: 0.9, 4: 1 };

/**
 * Physical inventory (sites, screens, coaches, editions, stations) scales with
 * the full factor: exponent 1. Digital and talent-led channels are bought by
 * audience, not by site, so widening the geography mostly widens targeting.
 * Their factor is softened to factor^0.5 (pan-India is 4x a city, not 16x).
 */
export const GEO_SCALING_EXPONENT = { physical: 1, digital: 0.5 } as const;
export const SOFT_GEO_SCALING_CATEGORIES: readonly CategoryId[] = ['Digital'];
/** Not in the Digital category, but bought nationally or by audience rather than by site. */
export const SOFT_GEO_SCALING_SLUGS: readonly string[] = ['influencers', 'brand-ambassadors'];

/* ------------------------------------------------------------------ */
/* Brand stage rules                                                   */
/* ------------------------------------------------------------------ */

export const STAGE_RULES: Record<StageId, { summary: string }> = {
  new: { summary: 'New and launching brands need to be seen first. Awareness channels get a boost: OOH, cinema, TV, influencers and PR.' },
  growing: { summary: 'Growing brands need balance. Efficient reach and always-on digital both score well.' },
  established: { summary: 'Established brands already have recall. The plan tilts to performance: search and social.' },
  relaunch: { summary: 'A relaunch has to change minds. PR, OOH and social get a boost.' },
};

/** Stage fit per channel, 1 to 5. Also shown on channel pages as "best for" brand stages. */
export const STAGE_FIT_BY_SLUG: Record<string, Record<StageId, Level>> = {
  print: { new: 4, growing: 3, established: 3, relaunch: 3 },
  television: { new: 5, growing: 3, established: 3, relaunch: 4 },
  radio: { new: 3, growing: 4, established: 3, relaunch: 3 },
  cinema: { new: 5, growing: 3, established: 2, relaunch: 3 },
  hoardings: { new: 5, growing: 4, established: 3, relaunch: 5 },
  'digital-ooh': { new: 5, growing: 4, established: 3, relaunch: 5 },
  'bus-brts-auto': { new: 4, growing: 4, established: 3, relaunch: 4 },
  'metro-wraps': { new: 5, growing: 3, established: 2, relaunch: 4 },
  'inside-metro': { new: 4, growing: 4, established: 3, relaunch: 4 },
  railways: { new: 3, growing: 4, established: 3, relaunch: 3 },
  airport: { new: 4, growing: 3, established: 4, relaunch: 4 },
  airline: { new: 3, growing: 3, established: 4, relaunch: 3 },
  'stadiums-sports': { new: 4, growing: 3, established: 4, relaunch: 3 },
  'brand-ambassadors': { new: 4, growing: 3, established: 4, relaunch: 5 },
  influencers: { new: 5, growing: 4, established: 3, relaunch: 4 },
  'social-media': { new: 4, growing: 4, established: 5, relaunch: 5 },
  'search-performance': { new: 3, growing: 4, established: 5, relaunch: 3 },
  'digital-pr': { new: 5, growing: 3, established: 3, relaunch: 5 },
};

/** Used for any channel that is not in STAGE_FIT_BY_SLUG (for example one you add later). */
export const STAGE_FIT_BY_CATEGORY: Record<CategoryId, Record<StageId, Level>> = {
  ATL: { new: 4, growing: 3, established: 3, relaunch: 3 },
  OOH: { new: 5, growing: 4, established: 3, relaunch: 5 },
  Transit: { new: 4, growing: 4, established: 3, relaunch: 4 },
  Travel: { new: 3, growing: 3, established: 4, relaunch: 3 },
  Fame: { new: 4, growing: 3, established: 3, relaunch: 4 },
  Digital: { new: 4, growing: 4, established: 5, relaunch: 4 },
};

export function stageFitFor(channel: { slug: string; category: string }, stage: StageId): Level {
  const bySlug = STAGE_FIT_BY_SLUG[channel.slug];
  if (bySlug) return bySlug[stage];
  const byCategory = STAGE_FIT_BY_CATEGORY[channel.category as CategoryId];
  return byCategory ? byCategory[stage] : 3;
}

/** Stages where the channel scores 4 or 5, strongest first. Handy for "best for" chips. */
export function bestStagesFor(channel: { slug: string; category: string }): StageId[] {
  const stages: StageId[] = ['new', 'growing', 'established', 'relaunch'];
  return stages
    .map((stage, i) => ({ stage, fit: stageFitFor(channel, stage), i }))
    .filter((s) => s.fit >= 4)
    .sort((a, b) => b.fit - a.fit || a.i - b.i)
    .map((s) => s.stage);
}

/** The 18 channel slugs the planner knows. URL state is validated against this list. */
export const PLANNER_CHANNEL_SLUGS: readonly string[] = Object.keys(STAGE_FIT_BY_SLUG);

/* ------------------------------------------------------------------ */
/* Reach                                                               */
/* ------------------------------------------------------------------ */

/**
 * Average exposures per person reached in ONE month. Reach = impressions /
 * frequency. Media on a daily route (hoardings, transit) is seen again and
 * again, so frequency is high. Occasional media (cinema, airports, flights)
 * is seen once or twice.
 */
export const ASSUMED_FREQUENCY: Record<string, number> = {
  print: 4,
  television: 6,
  radio: 8,
  cinema: 1.5,
  hoardings: 10,
  'digital-ooh': 8,
  'bus-brts-auto': 10,
  'metro-wraps': 10,
  'inside-metro': 12,
  railways: 6,
  airport: 2,
  airline: 1.5,
  'stadiums-sports': 3,
  'brand-ambassadors': 4,
  influencers: 3,
  'social-media': 5,
  'search-performance': 2.5,
  'digital-pr': 2,
};
export const DEFAULT_FREQUENCY = 4;

/**
 * A longer campaign mostly reaches the same people again. Campaign frequency
 * = monthly frequency x months^0.7, so reach grows far more slowly than
 * impressions as the duration grows.
 */
export const FREQUENCY_DURATION_EXPONENT = 0.7;

/**
 * Total reach is never the sum of channel reach, because the same person sees
 * several channels. The engine removes `perExtraChannel` of the summed reach
 * for every channel after the first (7% for two channels, 14% for three), up
 * to `max`. The result is never below the largest single channel.
 */
export const OVERLAP_DISCOUNT = { perExtraChannel: 0.07, max: 0.45 } as const;

/** Reach is capped at a plausible share of the population in play. */
export const REACH_CAP = { perChannelShare: 0.45, totalShare: 0.6 } as const;

/**
 * Population in play, used only for the reach cap. Rounded approximations
 * based on public census projections, in lakh (1 L = 1,00,000). Replace them
 * with your own universe estimates.
 */
export const CITY_POPULATION_LAKH_BY_TIER: Record<TierId, number> = { metro: 120, tier1: 30, tier2: 12, tier3Rural: 3 };

export const STATE_POPULATION_LAKH: Record<string, number> = {
  jk: 138, hp: 75, pb: 310, ch: 12, hr: 300, dl: 210, ut: 115, up: 2350, rj: 810,
  gj: 710, mh: 1260, ga: 16, dn: 6, dd: 4,
  mp: 860, ct: 300,
  br: 1270, jh: 390, or: 460, wb: 990, an: 4,
  ap: 530, tg: 380, ka: 680, kl: 360, tn: 770, py: 16, ld: 1,
  as: 355, ar: 16, mn: 32, ml: 33, mz: 12, nl: 22, tr: 41, sk: 7,
};
export const DEFAULT_STATE_POPULATION_LAKH = 300;

/** Zone population is the sum of its states. */
export const ZONE_POPULATION_LAKH: Record<ZoneId, number> = STATES.reduce(
  (acc, s) => {
    acc[s.zone] += STATE_POPULATION_LAKH[s.id] ?? 0;
    return acc;
  },
  { north: 0, south: 0, east: 0, west: 0, central: 0, 'north-east': 0 } as Record<ZoneId, number>,
);

/** Rough share of a state's or zone's population living in each market tier. */
export const POPULATION_SHARE_BY_TIER: Record<TierId, number> = { metro: 0.08, tier1: 0.07, tier2: 0.15, tier3Rural: 0.7 };
