/**
 * Media Planner engine. Pure TypeScript: no React, no file system, no dates,
 * no randomness. The same input always gives the same output.
 *
 * Every number used here comes from data/planner-weights.ts, the channel
 * frontmatter (costs and fit scores) or data/industries.ts (CPL ranges).
 * All of them are planning placeholders, so every result is indicative.
 */
import type { AudienceId } from '@/data/audiences';
import { cityById } from '@/data/cities';
import type { IndustryId } from '@/data/industries';
import { CPL_BY_INDUSTRY } from '@/data/industries';
import type { ObjectiveId, StageId } from '@/data/objectives';
import type { TierId, ZoneId } from '@/data/regions';
import { TIER_CPM_MULTIPLIER, TIER_IDS, ZONE_IDS, stateById, tierLabel, zoneLabel } from '@/data/regions';
import {
  ALLOCATION_EXPONENT,
  ASSUMED_FREQUENCY,
  BUDGET_LIMITS,
  CHANNEL_COUNT_BY_BUDGET,
  CITY_COUNT_FACTOR,
  CITY_POPULATION_LAKH_BY_TIER,
  DEFAULT_FREQUENCY,
  DEFAULT_STATE_POPULATION_LAKH,
  FREQUENCY_DURATION_EXPONENT,
  GEO_SCALING_EXPONENT,
  INTENSITY,
  INTENSITY_META,
  INTENSITY_ORDER,
  MAX_SHARE_PCT,
  MIN_TRACKABLE_DIGITAL_PCT,
  NEUTRAL_AUDIENCE_SCORE,
  OVERLAP_DISCOUNT,
  PERFORMANCE_OBJECTIVES,
  PERFORMANCE_SLUGS,
  POPULATION_SHARE_BY_TIER,
  REACH_CAP,
  REGION_STRENGTH_MIX,
  SCENARIO_RANGE,
  SCORE_WEIGHTS,
  SOFT_GEO_SCALING_CATEGORIES,
  SOFT_GEO_SCALING_SLUGS,
  SPEND_ROUNDING_INR,
  STATE_POPULATION_LAKH,
  TIER_BREADTH_FACTOR,
  TRACKABLE_DIGITAL_SLUGS,
  ZONE_POPULATION_LAKH,
  stageFitFor,
} from '@/data/planner-weights';
import { formatCountCompact, formatINR, formatINRCompact, groupIndian } from '@/lib/format-inr';
import type {
  BudgetPlan,
  ChannelsPlan,
  MixLine,
  PlanResult,
  PlanTotals,
  PlannerChannel,
  PlannerInput,
  PlannerRegion,
  Range,
  RegionScope,
  Scenario,
  ScenarioLine,
  Suggestion,
} from './types';

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

const STEP = SPEND_ROUNDING_INR;
const roundStep = (n: number) => Math.round(n / STEP) * STEP;
const ceilStep = (n: number) => Math.ceil(n / STEP - 1e-9) * STEP;
const floorStep = (n: number) => Math.floor(n / STEP + 1e-9) * STEP;
const round3 = (n: number) => Math.round(n * 1000) / 1000;
const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const unique = <T>(xs: T[]) => Array.from(new Set(xs));
const trimNum = (n: number, digits = 2) => {
  const fixed = n.toFixed(digits);
  return fixed.includes('.') ? fixed.replace(/\.?0+$/, '') : fixed;
};
const pct = (n: number) => `${trimNum(n * 100, 0)}%`;

function joinList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

function monthsText(months: number) {
  return months === 1 ? '1 month' : `${months} months`;
}

function countText(n: number) {
  return n < 100000 ? groupIndian(n) : formatCountCompact(n);
}

function countRangeText(r: Range) {
  const low = countText(r.low);
  const high = countText(r.high);
  return low === high ? `about ${low}` : `${low} to ${high}`;
}

/* ------------------------------------------------------------------ */
/* Region                                                              */
/* ------------------------------------------------------------------ */

export type ResolvedRegion = {
  /** The scope actually used (an unknown city or state, or zero / six zones, resolves to pan-India). */
  scope: RegionScope;
  zones: ZoneId[];
  tiers: TierId[];
  /** "Ahmedabad", "Gujarat", "North and West India", "India". */
  label: string;
  /** "in Ahmedabad", "across India". */
  phrase: string;
  /** Average tier cost multiplier over the tiers in play. */
  cpmMultiplier: number;
  /** Effective number of city-sized buys for physical inventory. */
  cityCountFactor: number;
  /** Estimated people living in the markets in play. Used only to cap reach. */
  population: number;
};

function cleanTiers(tiers: TierId[] | undefined): TierId[] {
  const picked = TIER_IDS.filter((t) => (tiers ?? []).includes(t));
  return picked.length ? picked : [...TIER_IDS];
}

/** Turns the region input into the zones, tiers, cost multiplier and footprint the engine uses. */
export function resolveRegion(region: PlannerRegion): ResolvedRegion {
  if (region.scope === 'city') {
    const city = region.city ? cityById(region.city) : undefined;
    if (city) {
      return {
        scope: 'city',
        zones: [city.zone],
        tiers: [city.tier],
        label: city.name,
        phrase: `in ${city.name}`,
        cpmMultiplier: TIER_CPM_MULTIPLIER[city.tier],
        cityCountFactor: CITY_COUNT_FACTOR.city,
        population: CITY_POPULATION_LAKH_BY_TIER[city.tier] * 1e5,
      };
    }
  }

  const tiers = cleanTiers(region.tiers);
  const cpmMultiplier = round3(avg(tiers.map((t) => TIER_CPM_MULTIPLIER[t])));
  const breadth = TIER_BREADTH_FACTOR[tiers.length as 1 | 2 | 3 | 4] ?? 1;
  const tierShare = sum(tiers.map((t) => POPULATION_SHARE_BY_TIER[t]));

  if (region.scope === 'state') {
    const state = region.state ? stateById(region.state) : undefined;
    if (state) {
      return {
        scope: 'state',
        zones: [state.zone],
        tiers,
        label: state.name,
        phrase: `in ${state.name}`,
        cpmMultiplier,
        cityCountFactor: round3(CITY_COUNT_FACTOR.state * breadth),
        population: Math.round((STATE_POPULATION_LAKH[state.id] ?? DEFAULT_STATE_POPULATION_LAKH) * 1e5 * tierShare),
      };
    }
  }

  if (region.scope === 'zones') {
    const zones = ZONE_IDS.filter((z) => (region.zones ?? []).includes(z));
    if (zones.length > 0 && zones.length < ZONE_IDS.length) {
      const label = `${joinList(zones.map((z) => zoneLabel(z)))} India`;
      return {
        scope: 'zones',
        zones,
        tiers,
        label,
        phrase: `in ${label}`,
        cpmMultiplier,
        cityCountFactor: round3(Math.min(CITY_COUNT_FACTOR.perZone * zones.length, CITY_COUNT_FACTOR.panIndia) * breadth),
        population: Math.round(sum(zones.map((z) => ZONE_POPULATION_LAKH[z])) * 1e5 * tierShare),
      };
    }
  }

  return {
    scope: 'pan-india',
    zones: [...ZONE_IDS],
    tiers,
    label: 'India',
    phrase: 'across India',
    cpmMultiplier,
    cityCountFactor: round3(CITY_COUNT_FACTOR.panIndia * breadth),
    population: Math.round(sum(ZONE_IDS.map((z) => ZONE_POPULATION_LAKH[z])) * 1e5 * tierShare),
  };
}

function isSoftGeo(ch: PlannerChannel) {
  return SOFT_GEO_SCALING_CATEGORIES.includes(ch.category) || SOFT_GEO_SCALING_SLUGS.includes(ch.slug);
}

/** City-count factor for one channel: full for physical inventory, softened for digital. */
export function geoFactorFor(ch: PlannerChannel, region: ResolvedRegion): number {
  const exponent = isSoftGeo(ch) ? GEO_SCALING_EXPONENT.digital : GEO_SCALING_EXPONENT.physical;
  return round3(Math.pow(region.cityCountFactor, exponent));
}

/** Spend for one channel at a given intensity in a given region (Mode B formula). */
function intensitySpend(ch: PlannerChannel, months: number, intensity: number, region: ResolvedRegion) {
  const raw = ch.costs.minMonthlyINR * months * intensity * region.cpmMultiplier * geoFactorFor(ch, region);
  return Math.max(STEP, roundStep(raw));
}

/* ------------------------------------------------------------------ */
/* Scoring                                                             */
/* ------------------------------------------------------------------ */

export type ScoreParts = { industry: number; objective: number; stage: number; region: number; audience: number };
export type ChannelScore = { slug: string; score: number; parts: ScoreParts };

function scoreOne(input: PlannerInput, ch: PlannerChannel, region: ResolvedRegion): ChannelScore {
  const zonePart = avg(region.zones.map((z) => ch.zoneStrength[z] ?? 3));
  const tierPart = avg(region.tiers.map((t) => ch.tierStrength[t] ?? 3));
  const audiences = unique(input.audiences ?? []).filter((a) => ch.audienceAffinity[a] !== undefined);
  const parts: ScoreParts = {
    industry: ch.industryFit[input.industry] ?? 3,
    objective: ch.objectiveFit[input.objective] ?? 3,
    stage: stageFitFor(ch, input.stage),
    region: round3(REGION_STRENGTH_MIX.zone * zonePart + REGION_STRENGTH_MIX.tier * tierPart),
    audience: audiences.length ? round3(avg(audiences.map((a) => ch.audienceAffinity[a]))) : NEUTRAL_AUDIENCE_SCORE,
  };
  const score =
    SCORE_WEIGHTS.industry * parts.industry +
    SCORE_WEIGHTS.objective * parts.objective +
    SCORE_WEIGHTS.stage * parts.stage +
    SCORE_WEIGHTS.region * parts.region +
    SCORE_WEIGHTS.audience * parts.audience;
  return { slug: ch.slug, score: round3(score), parts };
}

/**
 * Scores every channel on a 1 to 5 scale for this brief. Returned best first
 * (ties keep the channel order of the site).
 */
export function scoreChannels(input: PlannerInput, channels: PlannerChannel[]): ChannelScore[] {
  const region = resolveRegion(input.region);
  const order = new Map(channels.map((c, i) => [c.slug, c.order * 1000 + i]));
  return channels
    .map((ch) => scoreOne(input, ch, region))
    .sort((a, b) => b.score - a.score || (order.get(a.slug) ?? 0) - (order.get(b.slug) ?? 0));
}

/* ------------------------------------------------------------------ */
/* Copy: "why" lines                                                   */
/* ------------------------------------------------------------------ */

const INDUSTRY_PHRASE: Record<IndustryId, string> = {
  'real-estate': 'real estate',
  healthcare: 'healthcare',
  education: 'education',
  'fmcg-d2c': 'FMCG and D2C',
  bfsi: 'BFSI',
  'auto-ev': 'auto and EV',
  'renewable-energy': 'renewable energy',
  retail: 'retail',
};

const OBJECTIVE_PHRASE: Record<ObjectiveId, string> = {
  awareness: 'awareness',
  consideration: 'trust building',
  leads: 'lead generation',
  sales: 'sales',
  launch: 'launches',
};

const STAGE_PHRASE: Record<StageId, string> = {
  new: 'new brands',
  growing: 'growing brands',
  established: 'established brands',
  relaunch: 'relaunches',
};

const AUDIENCE_PHRASE: Record<AudienceId, string> = {
  genz: 'Gen Z',
  'urban-pros': 'urban young professionals',
  families: 'families',
  bharat: 'Bharat audiences',
  'decision-makers': 'business decision-makers',
  affluent: 'affluent audiences',
  commuters: 'daily commuters',
  'sports-fans': 'sports fans',
};

const STRONG_PART = 3.5;
const VERY_STRONG_PART = 4.5;

/** One plain sentence built from the strongest scoring parts. Empty when nothing stands out. */
function fitSentence(ch: PlannerChannel, s: ChannelScore, input: PlannerInput, region: ResolvedRegion): string {
  const keys = (Object.keys(SCORE_WEIGHTS) as (keyof ScoreParts)[])
    .map((key, i) => ({ key, value: s.parts[key], i }))
    .filter((p) => p.value >= STRONG_PART)
    .sort((a, b) => b.value - a.value || a.i - b.i);
  if (!keys.length) return '';
  const has = (k: keyof ScoreParts) => keys.some((p) => p.key === k);
  const lead = keys[0].value >= VERY_STRONG_PART ? 'Strong' : 'Good';

  const subjects: string[] = [];
  for (const p of keys) {
    if (subjects.length >= 2) break;
    if (p.key === 'industry' || p.key === 'objective') {
      const phrase =
        has('industry') && has('objective')
          ? `${INDUSTRY_PHRASE[input.industry]} ${OBJECTIVE_PHRASE[input.objective]}`
          : has('industry')
            ? `${INDUSTRY_PHRASE[input.industry]} brands`
            : OBJECTIVE_PHRASE[input.objective];
      if (!subjects.includes(phrase)) subjects.push(phrase);
    } else if (p.key === 'stage') {
      subjects.push(STAGE_PHRASE[input.stage]);
    } else if (p.key === 'audience') {
      const best = unique(input.audiences)
        .filter((a) => ch.audienceAffinity[a] !== undefined)
        .sort((a, b) => ch.audienceAffinity[b] - ch.audienceAffinity[a])[0];
      if (best) subjects.push(AUDIENCE_PHRASE[best]);
    }
  }
  const where = has('region') ? ` ${region.phrase}` : '';
  if (!subjects.length) return `${lead} presence ${region.phrase}.`;
  return `${lead} fit for ${subjects.join(' and ')}${where}.`;
}

/* ------------------------------------------------------------------ */
/* Estimates                                                           */
/* ------------------------------------------------------------------ */

type EstimateContext = { region: ResolvedRegion; months: number; industry: IndustryId };

function campaignFrequency(slug: string, months: number) {
  const monthly = ASSUMED_FREQUENCY[slug] ?? DEFAULT_FREQUENCY;
  return monthly * Math.pow(Math.max(1, months), FREQUENCY_DURATION_EXPONENT);
}

function estimateLine(ch: PlannerChannel, spend: number, ctx: EstimateContext) {
  const cpmLow = Math.min(ch.costs.cpm.low, ch.costs.cpm.high) * ctx.region.cpmMultiplier;
  const cpmHigh = Math.max(ch.costs.cpm.low, ch.costs.cpm.high) * ctx.region.cpmMultiplier;
  const impressions: Range = {
    low: Math.round((spend / cpmHigh) * 1000),
    high: Math.round((spend / cpmLow) * 1000),
  };
  const frequency = campaignFrequency(ch.slug, ctx.months);
  const cap = ctx.region.population * REACH_CAP.perChannelShare;
  const reach: Range = {
    low: Math.round(Math.min(impressions.low / frequency, cap)),
    high: Math.round(Math.min(impressions.high / frequency, cap)),
  };
  let leads: Range | undefined;
  if (PERFORMANCE_SLUGS.includes(ch.slug)) {
    const cpl = CPL_BY_INDUSTRY[ctx.industry];
    leads = { low: Math.floor(spend / cpl.high), high: Math.floor(spend / cpl.low) };
  }
  return { impressions, reach, leads };
}

/** Overlap discount for a plan with n channels. */
export function overlapDiscount(channelCount: number): number {
  if (channelCount <= 1) return 0;
  return round3(Math.min(OVERLAP_DISCOUNT.max, OVERLAP_DISCOUNT.perExtraChannel * (channelCount - 1)));
}

/**
 * De-duplicated reach. Summed channel reach is cut by the overlap discount,
 * never falls below the largest single channel, and is capped at a share of
 * the population in play.
 */
function dedupeReach(values: number[], population: number): number {
  if (!values.length) return 0;
  const discounted = sum(values) * (1 - overlapDiscount(values.length));
  const floor = Math.max(...values);
  return Math.round(Math.min(Math.max(discounted, floor), population * REACH_CAP.totalShare));
}

function totalsFor(
  lines: { impressions: Range; reach: Range; leads?: Range }[],
  ctx: EstimateContext,
): PlanTotals {
  const totals: PlanTotals = {
    impressions: { low: sum(lines.map((l) => l.impressions.low)), high: sum(lines.map((l) => l.impressions.high)) },
    reach: {
      low: dedupeReach(lines.map((l) => l.reach.low), ctx.region.population),
      high: dedupeReach(lines.map((l) => l.reach.high), ctx.region.population),
    },
  };
  const withLeads = lines.filter((l) => l.leads);
  if (withLeads.length) {
    const cpl = CPL_BY_INDUSTRY[ctx.industry];
    totals.leads = { low: sum(withLeads.map((l) => l.leads!.low)), high: sum(withLeads.map((l) => l.leads!.high)) };
    totals.cpl = { low: cpl.low, high: cpl.high };
  }
  return totals;
}

const ZERO_TOTALS = (): PlanTotals => ({ impressions: { low: 0, high: 0 }, reach: { low: 0, high: 0 } });

function isPerformanceObjective(objective: ObjectiveId) {
  return PERFORMANCE_OBJECTIVES.includes(objective);
}

function kpiLineFor(input: PlannerInput, totals: PlanTotals, hasLines: boolean): string {
  if (!hasLines) return 'No estimate yet. Add at least one channel to see reach and results';
  const reachText = `Estimated reach ${countRangeText(totals.reach)} people`;
  if (isPerformanceObjective(input.objective)) {
    if (totals.leads && totals.cpl) {
      const cpl = CPL_BY_INDUSTRY[input.industry];
      const noun = cpl.unit.includes('purchase') ? 'purchases or leads' : 'leads';
      return `Estimated ${countRangeText(totals.leads)} ${noun} at ${formatINR(totals.cpl.low)} to ${formatINR(totals.cpl.high)} ${cpl.unit}`;
    }
    return `${reachText}. Add social or search to estimate leads`;
  }
  return `${reachText}, from ${countRangeText(totals.impressions)} impressions`;
}

/* ------------------------------------------------------------------ */
/* Assumptions                                                         */
/* ------------------------------------------------------------------ */

function multiplierText(region: ResolvedRegion): string {
  if (region.tiers.length === 1) {
    return `Market cost multiplier used: ${trimNum(region.cpmMultiplier)} (${tierLabel(region.tiers[0])}).`;
  }
  const parts = region.tiers.map((t) => `${tierLabel(t)} ${trimNum(TIER_CPM_MULTIPLIER[t])}`);
  return `Market cost multiplier used: ${trimNum(region.cpmMultiplier)}, the average of ${joinList(parts)}.`;
}

function sharedAssumptions(
  input: PlannerInput,
  region: ResolvedRegion,
  used: PlannerChannel[],
  hasLeads: boolean,
): string[] {
  const w = SCORE_WEIGHTS;
  const out: string[] = [
    'All figures are indicative planning estimates, not a quote. Rates, CPMs and minimums are placeholders until replaced with live rate cards.',
    `Channel scores blend industry fit (${pct(w.industry)}), objective fit (${pct(w.objective)}), brand stage (${pct(w.stage)}), regional strength (${pct(w.region)}) and audience affinity (${pct(w.audience)}), each on a 1 to 5 scale.`,
    'Impressions = spend ÷ (CPM × market cost multiplier) × 1,000. The low figure uses the high CPM and the high figure uses the low CPM.',
    multiplierText(region),
  ];
  if (used.length) {
    const freq = used.map((c) => `${c.shortName} ${trimNum(ASSUMED_FREQUENCY[c.slug] ?? DEFAULT_FREQUENCY, 1)}`);
    const duration =
      input.months > 1
        ? ` Over ${monthsText(input.months)} frequency builds by a factor of ${trimNum(Math.pow(input.months, FREQUENCY_DURATION_EXPONENT), 1)}, because a longer campaign mostly reaches the same people again.`
        : '';
    out.push(`Reach = impressions ÷ assumed frequency. Average exposures per person in a month: ${joinList(freq)}.${duration}`);
    const discount = overlapDiscount(used.length);
    const overlap =
      used.length > 1
        ? `An overlap discount of ${pct(discount)} is applied for ${used.length} channels, because the same people see more than one channel.`
        : 'With one channel there is no overlap discount.';
    out.push(
      `Total reach is not a simple sum. ${overlap} Reach is capped at ${pct(REACH_CAP.totalShare)} of an estimated ${formatCountCompact(region.population)} people ${region.phrase}.`,
    );
  }
  if (hasLeads) {
    const cpl = CPL_BY_INDUSTRY[input.industry];
    out.push(
      `Leads = spend on social and search ÷ a placeholder cost of ${formatINR(cpl.low)} to ${formatINR(cpl.high)} ${cpl.unit} for ${INDUSTRY_PHRASE[input.industry]}. Other channels build demand but are not counted as leads.`,
    );
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Mode A: budget -> channels                                          */
/* ------------------------------------------------------------------ */

type Box = { w: number; lo: number; hi: number };

/** Splits `total` in proportion to weights, inside per-item floors and caps, in ₹1,000 steps. */
function distribute(total: number, items: Box[]): number[] {
  const n = items.length;
  if (n === 0) return [];
  if (n === 1) return [total];
  const fixed = new Array<number | null>(n).fill(null);
  let out = new Array<number>(n).fill(0);
  for (let guard = 0; guard <= n; guard++) {
    const free = items.map((_, i) => i).filter((i) => fixed[i] === null);
    const remaining = total - sum(fixed.map((v) => v ?? 0));
    const weight = sum(free.map((i) => items[i].w)) || 1;
    out = items.map((it, i) => (fixed[i] !== null ? (fixed[i] as number) : (remaining * it.w) / weight));
    const over = free.filter((i) => out[i] > items[i].hi + 1e-6);
    const under = free.filter((i) => out[i] < items[i].lo - 1e-6);
    if (!over.length && !under.length) break;
    const excess = sum(over.map((i) => out[i] - items[i].hi));
    const deficit = sum(under.map((i) => items[i].lo - out[i]));
    if (excess >= deficit) for (const i of over) fixed[i] = items[i].hi;
    else for (const i of under) fixed[i] = items[i].lo;
  }
  const rounded = out.map((v, i) => Math.min(items[i].hi, Math.max(items[i].lo, roundStep(v))));
  let diff = total - sum(rounded);
  const bySize = rounded.map((_, i) => i).sort((a, b) => rounded[b] - rounded[a] || a - b);
  for (const i of bySize) {
    if (diff === 0) break;
    const room = diff > 0 ? items[i].hi - rounded[i] : rounded[i] - items[i].lo;
    const move = Math.min(Math.abs(diff), Math.max(0, room));
    rounded[i] += diff > 0 ? move : -move;
    diff += diff > 0 ? -move : move;
  }
  if (diff !== 0) rounded[bySize[0]] += diff; // Only if floors and caps cannot both hold.
  return rounded;
}

function targetChannelCount(budget: number): number {
  const index = CHANNEL_COUNT_BY_BUDGET.findIndex((b) => budget < b.upToINR);
  const band = CHANNEL_COUNT_BY_BUDGET[index === -1 ? CHANNEL_COUNT_BY_BUDGET.length - 1 : index];
  const from = index > 0 ? CHANNEL_COUNT_BY_BUDGET[index - 1].upToINR : BUDGET_LIMITS.min;
  const to = Number.isFinite(band.upToINR) ? band.upToINR : BUDGET_LIMITS.max;
  const position = Math.min(1, Math.max(0, Math.log(budget / from) / Math.log(to / from)));
  return band.min + Math.round((band.max - band.min) * position);
}

/** Share percentages to one decimal that sum to exactly 100. The remainder goes on the largest line. */
function sharesFor(spends: number[], total: number): number[] {
  if (!spends.length || total <= 0) return spends.map(() => 0);
  const tenths = spends.map((s) => Math.round((s / total) * 1000));
  const diff = 1000 - sum(tenths);
  if (diff !== 0) {
    const bySize = tenths.map((_, i) => i).sort((a, b) => tenths[b] - tenths[a] || a - b);
    const capTenths = MAX_SHARE_PCT * 10;
    const target =
      spends.length > 1 && diff > 0 ? (bySize.find((i) => tenths[i] + diff <= capTenths) ?? bySize[0]) : bySize[0];
    tenths[target] += diff;
  }
  return tenths.map((t) => t / 10);
}

function normaliseBudget(raw: number, warnings: string[]): number {
  const value = Number.isFinite(raw) ? raw : BUDGET_LIMITS.min;
  if (value < BUDGET_LIMITS.min) {
    warnings.push(`The planner starts at ${formatINRCompact(BUDGET_LIMITS.min)}. We have planned for that amount.`);
  } else if (value > BUDGET_LIMITS.max) {
    warnings.push(
      `The planner goes up to ${formatINRCompact(BUDGET_LIMITS.max)}. We have planned for that amount. Talk to our team for larger plans.`,
    );
  }
  return roundStep(Math.min(BUDGET_LIMITS.max, Math.max(BUDGET_LIMITS.min, value)));
}

export function planFromBudget(input: PlannerInput, channels: PlannerChannel[]): BudgetPlan {
  const warnings: string[] = [];
  const months = Math.max(1, Number.isFinite(input.months) ? input.months : 1);
  const budget = normaliseBudget(input.budgetINR, warnings);
  const region = resolveRegion(input.region);
  const ctx: EstimateContext = { region, months, industry: input.industry };
  const performance = isPerformanceObjective(input.objective);
  const period = `over ${monthsText(months)}`;

  const bySlug = new Map(channels.map((c) => [c.slug, c]));
  const exclude = new Set(input.exclude ?? []);
  const candidates = channels.filter((c) => !exclude.has(c.slug));
  const scores = scoreChannels(input, candidates);
  const scoreOf = new Map(scores.map((s) => [s.slug, s]));
  const ranked = scores.map((s) => bySlug.get(s.slug)!);
  const rank = new Map(ranked.map((c, i) => [c.slug, i]));
  const minOf = (c: PlannerChannel) => c.costs.minMonthlyINR * months;

  const finish = (lineChannels: PlannerChannel[], spends: number[], notes: Map<string, string>): BudgetPlan => {
    const shares = sharesFor(spends, budget);
    const lines: MixLine[] = lineChannels.map((ch, i) => {
      const s = scoreOf.get(ch.slug)!;
      const est = estimateLine(ch, spends[i], ctx);
      const line: MixLine = {
        slug: ch.slug,
        name: ch.name,
        shortName: ch.shortName,
        category: ch.category,
        sharePct: shares[i],
        spendINR: spends[i],
        impressions: est.impressions,
        reach: est.reach,
        role: ch.roleKpi,
        why: fitSentence(ch, s, input, region) || notes.get(ch.slug) || 'A supporting channel that adds reach beyond the core mix.',
        score: s.score,
      };
      if (est.leads) line.leads = est.leads;
      return line;
    });
    lines.sort((a, b) => b.spendINR - a.spendINR || b.score - a.score || (rank.get(a.slug) ?? 0) - (rank.get(b.slug) ?? 0));
    const totals = lines.length ? totalsFor(lines, ctx) : ZERO_TOTALS();
    const inPlan = new Set(lines.map((l) => l.slug));
    const alsoConsider: Suggestion[] = ranked
      .filter((c) => !inPlan.has(c.slug))
      .slice(0, lines.length ? 3 : 0)
      .map((c) => {
        const fit = fitSentence(c, scoreOf.get(c.slug)!, input, region) || 'A useful next step to widen reach.';
        return { slug: c.slug, name: c.name, why: `${fit} From about ${formatINRCompact(minOf(c))} ${period}.` };
      });

    const used = lines.map((l) => bySlug.get(l.slug)!);
    const assumptions = sharedAssumptions(input, region, used, Boolean(totals.leads));
    assumptions.splice(
      2,
      0,
      `Budget is split in proportion to score^${ALLOCATION_EXPONENT}. Every channel must clear its minimum (monthly minimum × months), and no channel takes more than ${MAX_SHARE_PCT}% of a plan with two or more channels.`,
      ...(performance
        ? [`For leads and sales objectives, at least ${MIN_TRACKABLE_DIGITAL_PCT}% of the budget stays in trackable digital (social or search).`]
        : []),
    );
    return {
      mode: 'budget',
      input,
      totalINR: lines.length ? budget : 0,
      months,
      lines,
      totals,
      kpiLine: kpiLineFor(input, totals, lines.length > 0),
      alsoConsider,
      warnings,
      assumptions,
    };
  };

  /* Nothing to plan with. */
  if (!candidates.length) {
    warnings.push(
      channels.length
        ? 'Every channel is excluded, so there is nothing to plan. Remove at least one exclusion.'
        : 'No channels are available to plan with.',
    );
    return finish([], [], new Map());
  }

  /* Must-include requests. */
  const includeRequests: PlannerChannel[] = [];
  for (const slug of unique(input.include ?? [])) {
    const ch = bySlug.get(slug);
    if (!ch) warnings.push(`We do not recognise the channel "${slug}", so it was ignored.`);
    else if (exclude.has(slug)) warnings.push(`${ch.name} is in both must-include and exclude. We have left it out.`);
    else includeRequests.push(ch);
  }
  includeRequests.sort((a, b) => (rank.get(a.slug) ?? 0) - (rank.get(b.slug) ?? 0));

  /* Budget below every minimum: show the closest single channel. */
  const affordable = ranked.filter((c) => minOf(c) <= budget);
  if (!affordable.length) {
    const lowest = Math.min(...ranked.map(minOf));
    const pick = ranked.find((c) => minOf(c) === lowest)!;
    warnings.push(
      `${formatINRCompact(budget)} is below the practical minimum for every channel ${period}. We have shown ${pick.name}, which needs about ${formatINRCompact(lowest)}. Raise the budget or shorten the duration.`,
    );
    for (const ch of includeRequests) {
      if (ch.slug !== pick.slug) {
        warnings.push(`${ch.name} needs at least ${formatINRCompact(minOf(ch))} ${period}, so it does not fit this budget.`);
      }
    }
    return finish([pick], [budget], new Map());
  }

  const cap = floorStep((budget * MAX_SHARE_PCT) / 100);
  const reserve = ceilStep((budget * MIN_TRACKABLE_DIGITAL_PCT) / 100);
  const isTrackable = (c: PlannerChannel) => TRACKABLE_DIGITAL_SLUGS.includes(c.slug);
  const trackables = performance ? affordable.filter(isTrackable) : [];
  const bestTrackable = trackables[0];
  const notes = new Map<string, string>();
  const trackableNote = `Keeps at least ${MIN_TRACKABLE_DIGITAL_PCT}% of the budget trackable for ${input.objective === 'sales' ? 'sales' : 'leads'}.`;

  if (performance && !bestTrackable) {
    warnings.push(
      candidates.some(isTrackable)
        ? 'Social and search do not fit this budget and duration, so leads cannot be estimated.'
        : 'No trackable digital channel is available, so leads cannot be estimated. Allow social or search to see a lead range.',
    );
  }

  /* Leads or sales, and the budget only stretches to one trackable channel: put it all there. */
  if (bestTrackable && candidates.length > 1 && Math.max(minOf(bestTrackable), reserve) > cap) {
    for (const ch of includeRequests) {
      if (ch.slug !== bestTrackable.slug) {
        warnings.push(`${ch.name} needs at least ${formatINRCompact(minOf(ch))} ${period}, so it does not fit this budget.`);
      }
    }
    warnings.push(
      `At ${formatINRCompact(budget)} ${period}, the budget stretches to one trackable channel. All of it goes to ${bestTrackable.name}.`,
    );
    return finish([bestTrackable], [budget], notes);
  }

  /* Decide which must-includes fit. A fit means: within budget, within the 50% cap, and room for the others. */
  const forced: PlannerChannel[] = [];
  const floorOf = (c: PlannerChannel) => ceilStep(minOf(c));
  const committed = (list: PlannerChannel[]) => {
    const floors = sum(list.map(floorOf));
    if (!bestTrackable) return floors;
    const trackableFloors = sum(list.filter(isTrackable).map(floorOf));
    if (trackableFloors > 0) return floors + Math.max(0, reserve - trackableFloors);
    return floors + Math.max(reserve, floorOf(bestTrackable));
  };
  for (const ch of includeRequests) {
    const min = minOf(ch);
    if (min > budget) {
      warnings.push(`${ch.name} needs at least ${formatINRCompact(min)} ${period}, so it does not fit this budget.`);
    } else if (candidates.length > 1 && floorOf(ch) > cap) {
      warnings.push(
        `${ch.name} needs at least ${formatINRCompact(min)} ${period}, more than half of this budget. We have left it out to keep the mix balanced. It fits from about ${formatINRCompact(min * (100 / MAX_SHARE_PCT))}.`,
      );
    } else if (committed([...forced, ch]) > budget) {
      warnings.push(`${ch.name} needs at least ${formatINRCompact(min)} ${period}. It does not fit alongside your other must-have channels.`);
    } else {
      forced.push(ch);
      notes.set(ch.slug, 'Included at your request.');
    }
  }

  const protectedList = [...forced];
  if (bestTrackable && !forced.some(isTrackable)) {
    protectedList.push(bestTrackable);
    notes.set(bestTrackable.slug, trackableNote);
  }
  const isProtected = new Set(protectedList.map((c) => c.slug));
  const pool = affordable.filter((c) => !isProtected.has(c.slug));
  const target = Math.max(targetChannelCount(budget), protectedList.length, 1);

  const allocate = (selected: PlannerChannel[]): number[] => {
    if (selected.length === 1) return [budget];
    const weights = selected.map((c) => Math.pow(scoreOf.get(c.slug)!.score, ALLOCATION_EXPONENT));
    const hi = cap * selected.length >= budget ? cap : ceilStep((budget * MAX_SHARE_PCT) / 100);
    const trackWeight = sum(selected.map((c, i) => (performance && isTrackable(c) ? weights[i] : 0)));
    const boxes: Box[] = selected.map((c, i) => {
      let lo = isProtected.has(c.slug) ? ceilStep(minOf(c)) : 0;
      if (performance && isTrackable(c)) lo = Math.max(lo, ceilStep((reserve * weights[i]) / trackWeight));
      return { w: weights[i], lo: Math.min(lo, hi), hi };
    });
    return distribute(budget, boxes);
  };

  /*
   * Choose N. Start at the target for this budget and work down. For each N:
   * take the best-scoring channels, allocate, and if a line misses its minimum
   * drop the one furthest from it (the weaker score on a tie) and refill with
   * the next best. The first N where every line clears its minimum wins.
   */
  let selected: PlannerChannel[] = protectedList.length ? protectedList : [affordable[0]];
  let spends: number[] = allocate(selected);
  for (let n = Math.min(target, protectedList.length + pool.length); n >= Math.max(1, protectedList.length); n--) {
    const dropped = new Set<string>();
    let found = false;
    for (let guard = 0; guard <= pool.length; guard++) {
      const fill = pool.filter((c) => !dropped.has(c.slug)).slice(0, n - protectedList.length);
      const trial = [...protectedList, ...fill];
      if (trial.length < n) break;
      const trialSpends = allocate(trial);
      const below = trial
        .map((c, i) => ({ c, gap: minOf(c) / Math.max(1, trialSpends[i]) }))
        .filter((x) => !isProtected.has(x.c.slug) && x.gap > 1);
      if (!below.length) {
        selected = trial;
        spends = trialSpends;
        found = true;
        break;
      }
      below.sort((a, b) => b.gap - a.gap || (rank.get(b.c.slug) ?? 0) - (rank.get(a.c.slug) ?? 0));
      dropped.add(below[0].c.slug);
    }
    if (found) break;
  }

  /* Budget against geography. */
  if (region.cityCountFactor > 1) {
    const needed = sum(selected.map((c) => intensitySpend(c, months, INTENSITY.launch, region)));
    if (budget < needed) {
      warnings.push(
        `This budget looks thin for ${region.label}. A launch-level presence on these channels ${region.phrase} needs about ${formatINRCompact(needed)} ${period}. Consider fewer markets or a shorter, sharper burst.`,
      );
    }
  }

  return finish(selected, spends, notes);
}

/* ------------------------------------------------------------------ */
/* Mode B: channels -> budget                                          */
/* ------------------------------------------------------------------ */

export function planFromChannels(input: PlannerInput, channels: PlannerChannel[]): ChannelsPlan {
  const warnings: string[] = [];
  const months = Math.max(1, Number.isFinite(input.months) ? input.months : 1);
  const region = resolveRegion(input.region);
  const ctx: EstimateContext = { region, months, industry: input.industry };
  const bySlug = new Map(channels.map((c) => [c.slug, c]));

  const selected: PlannerChannel[] = [];
  for (const slug of unique(input.channels ?? [])) {
    const ch = bySlug.get(slug);
    if (ch) selected.push(ch);
    else warnings.push(`We do not recognise the channel "${slug}", so it was ignored.`);
  }
  if (!selected.length) warnings.push('No channels are selected. Pick at least one channel to see budget scenarios.');

  const scores = scoreChannels(input, channels);
  const scoreOf = new Map(scores.map((s) => [s.slug, s]));
  const order = new Map(channels.map((c, i) => [c.slug, c.order * 1000 + i]));

  const scenarios: Scenario[] = INTENSITY_ORDER.map((id) => {
    const lines: (ScenarioLine & { leads?: Range })[] = selected
      .map((ch) => {
        const spendINR = intensitySpend(ch, months, INTENSITY[id], region);
        const est = estimateLine(ch, spendINR, ctx);
        return { slug: ch.slug, name: ch.name, shortName: ch.shortName, spendINR, ...est };
      })
      .sort((a, b) => b.spendINR - a.spendINR || (order.get(a.slug) ?? 0) - (order.get(b.slug) ?? 0));
    const totalINR = sum(lines.map((l) => l.spendINR));
    const totals = lines.length ? totalsFor(lines, ctx) : ZERO_TOTALS();
    return {
      id,
      label: INTENSITY_META[id].label,
      blurb: INTENSITY_META[id].blurb,
      totalINR,
      totalRange: { low: roundStep(totalINR * SCENARIO_RANGE.low), high: roundStep(totalINR * SCENARIO_RANGE.high) },
      lines: lines.map(({ leads: _leads, ...line }) => line),
      totals,
    };
  });

  const hasPerformance = selected.some((c) => PERFORMANCE_SLUGS.includes(c.slug));
  if (selected.length && isPerformanceObjective(input.objective) && !hasPerformance) {
    warnings.push('No trackable digital channel is selected, so leads cannot be estimated. Consider adding social or search.');
  }

  const elevate = scenarios.find((s) => s.id === 'elevate') ?? scenarios[0];
  const kpi = kpiLineFor(input, elevate.totals, selected.length > 0);
  const kpiLine = selected.length ? `At ${elevate.label} intensity: ${kpi.charAt(0).toLowerCase()}${kpi.slice(1)}` : kpi;

  const picked = new Set(selected.map((c) => c.slug));
  const alsoConsider: Suggestion[] = scores
    .filter((s) => !picked.has(s.slug))
    .slice(0, selected.length ? 3 : 0)
    .map((s) => {
      const ch = bySlug.get(s.slug)!;
      const fit = fitSentence(ch, scoreOf.get(s.slug)!, input, region) || 'A useful addition to widen reach.';
      const from = intensitySpend(ch, months, INTENSITY.launch, region);
      return { slug: ch.slug, name: ch.name, why: `${fit} From about ${formatINRCompact(from)} over ${monthsText(months)}.` };
    });

  const assumptions = sharedAssumptions(input, region, selected, hasPerformance);
  const physical = trimNum(region.cityCountFactor);
  const digital = trimNum(Math.pow(region.cityCountFactor, GEO_SCALING_EXPONENT.digital));
  assumptions.splice(
    2,
    0,
    `Spend per channel = monthly minimum × months × intensity × market cost multiplier × geographic factor. Launch is ${INTENSITY.launch}×, Elevate is ${INTENSITY.elevate}× and Dominate is ${INTENSITY.dominate}×.`,
    region.cityCountFactor > 1
      ? `Geographic factor ${region.phrase}: ${physical}× a single-city buy for physical inventory and ${digital}× for digital and talent-led channels, which scale by audience and not by site.`
      : 'Geographic factor: 1, a single-city buy.',
    `Each scenario total carries a planning range of minus ${trimNum((1 - SCENARIO_RANGE.low) * 100, 0)}% to plus ${trimNum((SCENARIO_RANGE.high - 1) * 100, 0)}%.`,
  );

  return { mode: 'channels', input, months, scenarios, kpiLine, alsoConsider, warnings, assumptions };
}

/* ------------------------------------------------------------------ */
/* Dispatcher                                                          */
/* ------------------------------------------------------------------ */

export function plan(input: PlannerInput, channels: PlannerChannel[]): PlanResult {
  return input.mode === 'channels' ? planFromChannels(input, channels) : planFromBudget(input, channels);
}
