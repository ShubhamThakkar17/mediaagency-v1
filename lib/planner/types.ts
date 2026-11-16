import type { AudienceId } from '@/data/audiences';
import type { CategoryId } from '@/data/categories';
import type { IndustryId } from '@/data/industries';
import type { DurationMonths, ObjectiveId, StageId } from '@/data/objectives';
import type { TierId, ZoneId } from '@/data/regions';
import type { ChannelLite } from '@/lib/types';

export type PlannerChannel = ChannelLite;
export type PlannerMode = 'budget' | 'channels';
export type RegionScope = 'city' | 'state' | 'zones' | 'pan-india';
export type IntensityId = 'launch' | 'elevate' | 'dominate';

export type PlannerRegion = {
  scope: RegionScope;
  /** City id from data/cities.ts when scope is "city". */
  city?: string;
  /** State id from data/regions.ts when scope is "state". */
  state?: string;
  /** Used when scope is "zones". Empty or all six behaves like pan-India. */
  zones: ZoneId[];
  /** Market tiers in play. Empty means all tiers. Ignored for scope "city" (the city's own tier is used). */
  tiers: TierId[];
};

export type PlannerInput = {
  mode: PlannerMode;
  industry: IndustryId;
  objective: ObjectiveId;
  stage: StageId;
  region: PlannerRegion;
  audiences: AudienceId[];
  months: DurationMonths;
  /** Mode A (budget -> channels): total campaign budget in INR for the whole duration. */
  budgetINR: number;
  include: string[];
  exclude: string[];
  /** Mode B (channels -> budget): selected channel slugs. */
  channels: string[];
};

export type Range = { low: number; high: number };

export type MixLine = {
  slug: string;
  name: string;
  shortName: string;
  category: CategoryId;
  /** 0-100, lines sum to 100. */
  sharePct: number;
  spendINR: number;
  impressions: Range;
  reach: Range;
  /** The channel's role in this plan, e.g. "Reach and recall". */
  role: string;
  /** One line on why it made the mix. */
  why: string;
  score: number;
  /** Only for trackable performance channels. */
  leads?: Range;
};

export type Suggestion = { slug: string; name: string; why: string };

export type PlanTotals = {
  impressions: Range;
  reach: Range;
  /** Present when performance channels are in the mix. */
  leads?: Range;
  /** Cost-per-lead range used, INR. */
  cpl?: Range;
};

export type BudgetPlan = {
  mode: 'budget';
  input: PlannerInput;
  totalINR: number;
  months: number;
  lines: MixLine[];
  totals: PlanTotals;
  /** e.g. "Estimated reach 18 L to 42 L people" or "Estimated 420 to 1,900 leads at ₹300 to ₹1,500 per lead". */
  kpiLine: string;
  alsoConsider: Suggestion[];
  /** Human-readable notes, e.g. a requested channel that did not fit the budget. */
  warnings: string[];
  assumptions: string[];
};

export type ScenarioLine = {
  slug: string;
  name: string;
  shortName: string;
  spendINR: number;
  impressions: Range;
  reach: Range;
};

export type Scenario = {
  id: IntensityId;
  label: string;
  /** One line on what this intensity buys. */
  blurb: string;
  totalINR: number;
  /** Planning range around the total (roughly -15% / +20%). */
  totalRange: Range;
  lines: ScenarioLine[];
  totals: PlanTotals;
};

export type ChannelsPlan = {
  mode: 'channels';
  input: PlannerInput;
  months: number;
  scenarios: Scenario[];
  kpiLine: string;
  alsoConsider: Suggestion[];
  warnings: string[];
  assumptions: string[];
};

export type PlanResult = BudgetPlan | ChannelsPlan;
