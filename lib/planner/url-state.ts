/**
 * Planner state <-> URL query string, so a plan can be shared with one link.
 * Client-safe: no file system access. Decoding never throws. Anything missing
 * or invalid falls back to the default for that field.
 */
import type { AudienceId } from '@/data/audiences';
import { AUDIENCE_IDS } from '@/data/audiences';
import { cityById } from '@/data/cities';
import type { IndustryId } from '@/data/industries';
import { INDUSTRY_IDS } from '@/data/industries';
import type { DurationMonths, ObjectiveId, StageId } from '@/data/objectives';
import { DURATIONS, OBJECTIVE_IDS, STAGE_IDS } from '@/data/objectives';
import { BUDGET_LIMITS, PLANNER_CHANNEL_SLUGS, SPEND_ROUNDING_INR } from '@/data/planner-weights';
import type { TierId, ZoneId } from '@/data/regions';
import { TIER_IDS, ZONE_IDS, stateById } from '@/data/regions';
import { parseINR } from '@/lib/format-inr';
import type { PlannerInput, PlannerMode, PlannerRegion, RegionScope } from './types';

export const DEFAULT_INPUT: PlannerInput = {
  mode: 'budget',
  industry: 'real-estate',
  objective: 'leads',
  stage: 'growing',
  region: { scope: 'city', city: 'ahmedabad', zones: [], tiers: [] },
  audiences: [],
  months: 3,
  budgetINR: 2500000,
  include: [],
  exclude: [],
  channels: ['hoardings', 'social-media', 'search-performance'],
};

const MODES: readonly PlannerMode[] = ['budget', 'channels'];
const SCOPES: readonly RegionScope[] = ['city', 'state', 'zones', 'pan-india'];

export type StateOptions = {
  /** Valid channel slugs. Defaults to the 18 channels in data/planner-weights.ts. */
  slugs?: readonly string[];
};

function oneOf<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

/** Keeps valid ids only, without duplicates, in the canonical order of `allowed`. */
function pickOrdered<T extends string>(values: unknown, allowed: readonly T[]): T[] {
  const list = Array.isArray(values) ? values : [];
  return allowed.filter((id) => list.includes(id));
}

/** Keeps valid slugs only, without duplicates, in the order given. */
function pickSlugs(values: unknown, allowed: readonly string[]): string[] {
  const list = Array.isArray(values) ? values : [];
  const out: string[] = [];
  for (const v of list) {
    if (typeof v === 'string' && allowed.includes(v) && !out.includes(v)) out.push(v);
  }
  return out;
}

export function clampBudget(value: unknown): number {
  const n = typeof value === 'number' ? value : NaN;
  if (!Number.isFinite(n)) return DEFAULT_INPUT.budgetINR;
  const clamped = Math.min(BUDGET_LIMITS.max, Math.max(BUDGET_LIMITS.min, n));
  return Math.round(clamped / SPEND_ROUNDING_INR) * SPEND_ROUNDING_INR;
}

function normaliseRegion(region: Partial<PlannerRegion> | undefined): PlannerRegion {
  const fallback: PlannerRegion = { ...DEFAULT_INPUT.region, zones: [], tiers: [] };
  if (!region) return fallback;
  const scope = oneOf(region.scope, SCOPES, 'city');
  const tiers = pickOrdered<TierId>(region.tiers, TIER_IDS);
  if (scope === 'city') {
    const city = typeof region.city === 'string' && cityById(region.city) ? region.city : DEFAULT_INPUT.region.city!;
    return { scope, city, zones: [], tiers: [] };
  }
  if (scope === 'state') {
    if (typeof region.state !== 'string' || !stateById(region.state)) return fallback;
    return { scope, state: region.state, zones: [], tiers };
  }
  if (scope === 'zones') return { scope, zones: pickOrdered<ZoneId>(region.zones, ZONE_IDS), tiers };
  return { scope, zones: [], tiers };
}

/**
 * Returns a clean copy of any (possibly partial or invalid) input: valid ids,
 * a clamped budget rounded to ₹1,000, de-duplicated lists, and only the
 * region fields that belong to the chosen scope. A channel in both include
 * and exclude stays excluded.
 */
export function normalizeInput(input: Partial<PlannerInput> | undefined, opts: StateOptions = {}): PlannerInput {
  const slugs = opts.slugs ?? PLANNER_CHANNEL_SLUGS;
  const src = input ?? {};
  const exclude = pickSlugs(src.exclude, slugs);
  return {
    mode: oneOf(src.mode, MODES, DEFAULT_INPUT.mode),
    industry: oneOf<IndustryId>(src.industry, INDUSTRY_IDS, DEFAULT_INPUT.industry),
    objective: oneOf<ObjectiveId>(src.objective, OBJECTIVE_IDS, DEFAULT_INPUT.objective),
    stage: oneOf<StageId>(src.stage, STAGE_IDS, DEFAULT_INPUT.stage),
    region: normaliseRegion(src.region),
    audiences: pickOrdered<AudienceId>(src.audiences, AUDIENCE_IDS),
    months: (DURATIONS as readonly number[]).includes(src.months as number) ? (src.months as DurationMonths) : DEFAULT_INPUT.months,
    budgetINR: clampBudget(src.budgetINR),
    include: pickSlugs(src.include, slugs).filter((s) => !exclude.includes(s)),
    exclude,
    channels: Array.isArray(src.channels) ? pickSlugs(src.channels, slugs) : [...DEFAULT_INPUT.channels],
  };
}

const sameList = (a: readonly string[], b: readonly string[]) => a.length === b.length && a.every((v, i) => v === b[i]);

/** Query string without the leading "?". Values equal to the defaults are left out. */
export function encodeState(input: PlannerInput, opts: StateOptions = {}): string {
  const x = normalizeInput(input, opts);
  const d = DEFAULT_INPUT;
  const pairs: [string, string][] = [];
  const add = (key: string, value: string) => pairs.push([key, value]);
  const list = (items: readonly string[]) => items.map(encodeURIComponent).join(',');

  if (x.mode !== d.mode) add('mode', x.mode);
  if (x.industry !== d.industry) add('industry', x.industry);
  if (x.objective !== d.objective) add('objective', x.objective);
  if (x.stage !== d.stage) add('stage', x.stage);

  const r = x.region;
  if (r.scope !== d.region.scope) add('scope', r.scope);
  if (r.scope === 'city' && r.city && r.city !== d.region.city) add('city', encodeURIComponent(r.city));
  if (r.scope === 'state' && r.state) add('state', encodeURIComponent(r.state));
  if (r.scope === 'zones' && r.zones.length) add('zones', list(r.zones));
  if (r.scope !== 'city' && r.tiers.length) add('tiers', list(r.tiers));

  if (x.audiences.length) add('audiences', list(x.audiences));
  if (x.months !== d.months) add('months', String(x.months));
  if (x.budgetINR !== d.budgetINR) add('budget', String(x.budgetINR));
  if (x.include.length) add('include', list(x.include));
  if (x.exclude.length) add('exclude', list(x.exclude));
  // An empty selection is written as "channels=" so it is not mistaken for the default.
  if (!sameList(x.channels, d.channels)) add('channels', list(x.channels));

  return pairs.map(([k, v]) => `${k}=${v}`).join('&');
}

type ParamSource = URLSearchParams | Record<string, string | string[] | undefined>;

function reader(params: ParamSource | null | undefined) {
  const isUsp = typeof URLSearchParams !== 'undefined' && params instanceof URLSearchParams;
  const all = (key: string): string[] | undefined => {
    if (!params) return undefined;
    if (isUsp) {
      const usp = params as URLSearchParams;
      return usp.has(key) ? usp.getAll(key) : undefined;
    }
    const v = (params as Record<string, unknown>)[key];
    if (typeof v === 'string') return [v];
    if (Array.isArray(v)) return v.filter((s): s is string => typeof s === 'string');
    return undefined;
  };
  return {
    one: (key: string) => all(key)?.[0]?.trim(),
    /** undefined when the parameter is absent, otherwise the comma-separated items (possibly none). */
    many: (key: string) => {
      const values = all(key);
      if (!values) return undefined;
      return values
        .join(',')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    },
  };
}

/** Parses URL parameters into a valid PlannerInput. Tolerates missing and garbage values. */
export function decodeState(params: ParamSource | null | undefined, opts: StateOptions = {}): PlannerInput {
  const slugs = opts.slugs ?? PLANNER_CHANNEL_SLUGS;
  const q = reader(params);
  const d = DEFAULT_INPUT;

  // Scope: explicit when valid, otherwise inferred from whichever region parameter is present.
  const scopeRaw = q.one('scope');
  let scope: RegionScope = d.region.scope;
  if (scopeRaw && (SCOPES as readonly string[]).includes(scopeRaw)) scope = scopeRaw as RegionScope;
  else if (q.one('city')) scope = 'city';
  else if (q.one('state')) scope = 'state';
  else if (q.many('zones')?.length) scope = 'zones';

  const monthsRaw = Number(q.one('months'));
  const budgetText = q.one('budget');
  const budgetParsed = budgetText ? (parseINR(budgetText) ?? NaN) : NaN;

  const channelsRaw = q.many('channels');
  let channels: string[] | undefined;
  if (channelsRaw) {
    const valid = pickSlugs(channelsRaw, slugs);
    // Present but empty means "nothing selected". Present but all garbage falls back to the default.
    channels = valid.length || channelsRaw.length === 0 ? valid : undefined;
  }

  return normalizeInput(
    {
      mode: q.one('mode') as PlannerMode,
      industry: q.one('industry') as IndustryId,
      objective: q.one('objective') as ObjectiveId,
      stage: q.one('stage') as StageId,
      region: {
        scope,
        city: q.one('city'),
        state: q.one('state'),
        zones: (q.many('zones') ?? []) as ZoneId[],
        tiers: (q.many('tiers') ?? []) as TierId[],
      },
      audiences: (q.many('audiences') ?? []) as AudienceId[],
      months: monthsRaw as DurationMonths,
      budgetINR: budgetParsed,
      include: q.many('include') ?? [],
      exclude: q.many('exclude') ?? [],
      channels,
    },
    opts,
  );
}
