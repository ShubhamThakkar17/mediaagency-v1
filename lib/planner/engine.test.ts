import { describe, expect, it } from 'vitest';
import { getAllChannels, toLite } from '@/lib/channels';
import { CPL_BY_INDUSTRY } from '@/data/industries';
import {
  BUDGET_LIMITS,
  MAX_SHARE_PCT,
  MIN_TRACKABLE_DIGITAL_PCT,
  PLANNER_CHANNEL_SLUGS,
  SCORE_WEIGHTS,
  TRACKABLE_DIGITAL_SLUGS,
  bestStagesFor,
  stageFitFor,
} from '@/data/planner-weights';
import { STAGE_IDS } from '@/data/objectives';
import { overlapDiscount, plan, planFromBudget, planFromChannels, resolveRegion, scoreChannels } from './engine';
import { describeInput, planSummaryText } from './summary';
import { DEFAULT_INPUT } from './url-state';
import type { BudgetPlan, ChannelsPlan, PlannerInput, PlanResult } from './types';

const channels = getAllChannels().map(toLite);
const bySlug = new Map(channels.map((c) => [c.slug, c]));
const ALL_SLUGS = channels.map((c) => c.slug);

const make = (over: Partial<PlannerInput>): PlannerInput => ({ ...DEFAULT_INPUT, ...over });
const PAN_INDIA = { scope: 'pan-india' as const, zones: [], tiers: [] };
const FALLBACK_WARNING = 'below the practical minimum';

/** Compact, stable view of a result for snapshots. */
function project(result: PlanResult) {
  if (result.mode === 'budget') {
    return {
      totalINR: result.totalINR,
      lines: result.lines.map((l) => `${l.slug} | ${l.sharePct}% | ${l.spendINR}`),
      totals: result.totals,
      kpiLine: result.kpiLine,
      alsoConsider: result.alsoConsider.map((s) => s.slug),
      warnings: result.warnings,
    };
  }
  return {
    scenarios: result.scenarios.map((s) => ({
      id: s.id,
      totalINR: s.totalINR,
      totalRange: s.totalRange,
      lines: s.lines.map((l) => `${l.slug} | ${l.spendINR}`),
      totals: s.totals,
    })),
    kpiLine: result.kpiLine,
    alsoConsider: result.alsoConsider.map((s) => s.slug),
    warnings: result.warnings,
  };
}

function assertCopy(text: string) {
  expect(text).not.toMatch(/—/);
  expect(text).not.toMatch(/undefined|NaN|Infinity/);
}

function assertBudgetInvariants(input: PlannerInput) {
  const result = planFromBudget(input, channels);
  const expectedTotal = Math.round(Math.min(BUDGET_LIMITS.max, Math.max(BUDGET_LIMITS.min, input.budgetINR)) / 1000) * 1000;
  const allowed = channels.filter((c) => !input.exclude.includes(c.slug));

  // Deterministic.
  expect(planFromBudget(input, channels)).toEqual(result);
  expect(plan(input, channels)).toEqual(result);

  if (!allowed.length) {
    expect(result.lines).toEqual([]);
    return result;
  }
  expect(result.totalINR).toBe(expectedTotal);
  expect(result.lines.length).toBeGreaterThan(0);

  // Spends: ₹1,000 steps, exact sum, sorted.
  const spends = result.lines.map((l) => l.spendINR);
  expect(spends.reduce((a, b) => a + b, 0)).toBe(expectedTotal);
  for (const s of spends) expect(s % 1000).toBe(0);
  expect([...spends].sort((a, b) => b - a)).toEqual(spends);

  // Shares.
  const shareSum = result.lines.reduce((a, l) => a + l.sharePct, 0);
  expect(Math.abs(shareSum - 100)).toBeLessThanOrEqual(0.1);
  // Cap: spends move in ₹1,000 steps, so a line may sit at most one step above an exact 50%
  // (e.g. a ₹1,01,000 budget across two lines cannot split 50/50 in whole thousands).
  if (result.lines.length >= 2)
    for (const l of result.lines)
      expect(l.spendINR).toBeLessThanOrEqual(Math.ceil((expectedTotal * MAX_SHARE_PCT) / 100 / 1000) * 1000);
  else expect(result.lines[0].sharePct).toBe(100);

  // Minimums.
  const fallback = result.warnings.some((w) => w.includes(FALLBACK_WARNING));
  if (!fallback) {
    for (const l of result.lines) {
      expect(l.spendINR).toBeGreaterThanOrEqual(bySlug.get(l.slug)!.costs.minMonthlyINR * input.months);
    }
  }

  // Includes and excludes.
  const slugs = result.lines.map((l) => l.slug);
  for (const ex of input.exclude) expect(slugs).not.toContain(ex);
  for (const inc of input.include) {
    if (input.exclude.includes(inc)) continue;
    const name = bySlug.get(inc)?.name ?? inc;
    const explained = result.warnings.some((w) => w.includes(name));
    expect(slugs.includes(inc) || explained).toBe(true);
  }
  expect(new Set(slugs).size).toBe(slugs.length);

  // Trackable digital floor.
  if (['leads', 'sales'].includes(input.objective)) {
    const trackable = result.lines.filter((l) => TRACKABLE_DIGITAL_SLUGS.includes(l.slug)).reduce((a, l) => a + l.spendINR, 0);
    const possible = allowed.some((c) => TRACKABLE_DIGITAL_SLUGS.includes(c.slug) && c.costs.minMonthlyINR * input.months <= expectedTotal);
    if (possible) expect(trackable).toBeGreaterThanOrEqual((expectedTotal * MIN_TRACKABLE_DIGITAL_PCT) / 100);
    else expect(result.warnings.some((w) => w.includes('leads cannot be estimated')) || fallback).toBe(true);
  }

  // Estimates.
  for (const l of result.lines) {
    expect(l.impressions.low).toBeGreaterThan(0);
    expect(l.impressions.low).toBeLessThanOrEqual(l.impressions.high);
    expect(l.reach.low).toBeLessThanOrEqual(l.reach.high);
    expect(l.reach.high).toBeLessThanOrEqual(l.impressions.high);
    expect(l.role.length).toBeGreaterThan(0);
    expect(l.why.length).toBeGreaterThan(10);
    assertCopy(l.why);
    if (l.leads) expect(l.leads.low).toBeLessThanOrEqual(l.leads.high);
  }
  const t = result.totals;
  expect(t.impressions.low).toBeLessThanOrEqual(t.impressions.high);
  expect(t.reach.low).toBeLessThanOrEqual(t.reach.high);
  // Total reach is de-duplicated: never more than the sum, never less than the largest line.
  expect(t.reach.high).toBeLessThanOrEqual(result.lines.reduce((a, l) => a + l.reach.high, 0));
  expect(t.reach.high).toBeLessThanOrEqual(resolveRegion(input.region).population * 0.6 + 1);
  if (result.lines.length > 1) expect(t.reach.low).toBeLessThan(result.lines.reduce((a, l) => a + l.reach.low, 0));
  const hasPerformance = result.lines.some((l) => l.leads);
  expect(Boolean(t.leads)).toBe(hasPerformance);
  expect(Boolean(t.cpl)).toBe(hasPerformance);
  if (t.cpl) expect(t.cpl).toEqual({ low: CPL_BY_INDUSTRY[input.industry].low, high: CPL_BY_INDUSTRY[input.industry].high });

  // Copy.
  assertCopy(result.kpiLine);
  if (['leads', 'sales'].includes(input.objective) && hasPerformance) expect(result.kpiLine).toMatch(/leads at ₹/);
  if (!['leads', 'sales'].includes(input.objective)) expect(result.kpiLine).toMatch(/^Estimated reach /);
  expect(result.alsoConsider.length).toBeLessThanOrEqual(3);
  for (const s of result.alsoConsider) {
    expect(slugs).not.toContain(s.slug);
    expect(input.exclude).not.toContain(s.slug);
    assertCopy(s.why);
  }
  expect(result.assumptions.length).toBeGreaterThanOrEqual(5);
  expect(result.assumptions.join(' ')).toMatch(/not a quote/);
  for (const a of [...result.assumptions, ...result.warnings]) assertCopy(a);

  const text = planSummaryText(result, { brandName: 'Demo Agency' });
  expect(text.length).toBeLessThan(900);
  assertCopy(text);
  return result;
}

function assertChannelsInvariants(input: PlannerInput) {
  const result = planFromChannels(input, channels);
  expect(planFromChannels(input, channels)).toEqual(result);
  expect(plan(input, channels)).toEqual(result);
  expect(result.scenarios.map((s) => s.id)).toEqual(['launch', 'elevate', 'dominate']);
  const known = Array.from(new Set(input.channels)).filter((s) => bySlug.has(s));
  for (const s of result.scenarios) {
    expect(s.lines.map((l) => l.slug).sort()).toEqual([...known].sort());
    expect(s.lines.reduce((a, l) => a + l.spendINR, 0)).toBe(s.totalINR);
    expect(s.totalRange.low).toBeLessThanOrEqual(s.totalINR);
    expect(s.totalRange.high).toBeGreaterThanOrEqual(s.totalINR);
    for (const l of s.lines) {
      expect(l.spendINR % 1000).toBe(0);
      expect(l.impressions.low).toBeLessThanOrEqual(l.impressions.high);
      expect(l.reach.low).toBeLessThanOrEqual(l.reach.high);
    }
    expect(s.totals.reach.low).toBeLessThanOrEqual(s.totals.reach.high);
    assertCopy(s.blurb);
  }
  if (known.length) {
    const [launch, elevate, dominate] = result.scenarios;
    expect(launch.totalINR).toBeLessThan(elevate.totalINR);
    expect(elevate.totalINR).toBeLessThan(dominate.totalINR);
    expect(launch.totals.impressions.high).toBeLessThan(dominate.totals.impressions.high);
  }
  assertCopy(result.kpiLine);
  for (const a of [...result.assumptions, ...result.warnings, ...result.alsoConsider.map((s) => s.why)]) assertCopy(a);
  for (const s of result.alsoConsider) expect(known).not.toContain(s.slug);
  const text = planSummaryText(result, { brandName: 'Demo Agency' });
  expect(text.length).toBeLessThan(900);
  return result;
}

describe('channel data and weights', () => {
  it('loads 18 channels that the planner knows about', () => {
    expect(channels).toHaveLength(18);
    expect([...ALL_SLUGS].sort()).toEqual([...PLANNER_CHANNEL_SLUGS].sort());
  });

  it('weights sum to 1', () => {
    const total = Object.values(SCORE_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(total).toBeCloseTo(1, 10);
  });

  it('stage rules follow the brief', () => {
    const fit = (slug: string, stage: (typeof STAGE_IDS)[number]) => stageFitFor(bySlug.get(slug)!, stage);
    for (const slug of ['hoardings', 'digital-ooh', 'cinema', 'television', 'influencers', 'digital-pr']) {
      expect(fit(slug, 'new')).toBeGreaterThan(fit(slug, 'established'));
    }
    for (const slug of ['search-performance', 'social-media']) {
      expect(fit(slug, 'established')).toBe(5);
    }
    for (const slug of ['digital-pr', 'hoardings', 'social-media']) expect(fit(slug, 'relaunch')).toBe(5);
    for (const c of channels) {
      for (const stage of STAGE_IDS) {
        expect(stageFitFor(c, stage)).toBeGreaterThanOrEqual(1);
        expect(stageFitFor(c, stage)).toBeLessThanOrEqual(5);
      }
      expect(bestStagesFor(c).length).toBeGreaterThan(0);
    }
    expect(stageFitFor({ slug: 'something-new', category: 'OOH' }, 'new')).toBe(5);
    expect(stageFitFor({ slug: 'something-new', category: 'Unknown' }, 'new')).toBe(3);
  });
});

describe('scoreChannels', () => {
  it('returns every channel, best first, on a 1 to 5 scale', () => {
    const scores = scoreChannels(DEFAULT_INPUT, channels);
    expect(scores).toHaveLength(18);
    for (let i = 1; i < scores.length; i++) expect(scores[i - 1].score).toBeGreaterThanOrEqual(scores[i].score);
    for (const s of scores) {
      expect(s.score).toBeGreaterThanOrEqual(1);
      expect(s.score).toBeLessThanOrEqual(5);
      expect(s.parts.audience).toBe(3);
    }
  });

  it('uses selected audiences and the resolved region', () => {
    const scores = scoreChannels(make({ audiences: ['commuters', 'families'] }), channels);
    const hoardings = bySlug.get('hoardings')!;
    const s = scores.find((x) => x.slug === 'hoardings')!;
    expect(s.parts.audience).toBeCloseTo((hoardings.audienceAffinity.commuters + hoardings.audienceAffinity.families) / 2, 3);
    // Ahmedabad is a metro in the West zone.
    expect(s.parts.region).toBeCloseTo((hoardings.zoneStrength.west + hoardings.tierStrength.metro) / 2, 3);
  });

  it('resolves regions', () => {
    expect(resolveRegion({ scope: 'city', city: 'ahmedabad', zones: [], tiers: [] })).toMatchObject({ zones: ['west'], tiers: ['metro'], cpmMultiplier: 1.3, cityCountFactor: 1 });
    expect(resolveRegion({ scope: 'state', state: 'gj', zones: [], tiers: ['tier1', 'tier2'] })).toMatchObject({ zones: ['west'], tiers: ['tier1', 'tier2'], cpmMultiplier: 0.9, label: 'Gujarat' });
    expect(resolveRegion({ scope: 'zones', zones: ['north', 'west'], tiers: [] })).toMatchObject({ scope: 'zones', label: 'North and West India' });
    expect(resolveRegion({ scope: 'zones', zones: [], tiers: [] }).scope).toBe('pan-india');
    expect(resolveRegion({ scope: 'city', city: 'atlantis', zones: [], tiers: [] }).scope).toBe('pan-india');
    expect(resolveRegion(PAN_INDIA)).toMatchObject({ phrase: 'across India', cityCountFactor: 16 });
  });

  it('overlap discount grows with channel count and is capped', () => {
    expect(overlapDiscount(1)).toBe(0);
    expect(overlapDiscount(3)).toBeGreaterThan(overlapDiscount(2));
    expect(overlapDiscount(18)).toBe(overlapDiscount(30));
    expect(overlapDiscount(18)).toBeLessThan(1);
  });
});

const BUDGET_PERSONAS: [string, Partial<PlannerInput>][] = [
  ['Ahmedabad real-estate launch ₹40 L / 3 months', { industry: 'real-estate', objective: 'launch', stage: 'new', budgetINR: 4000000, months: 3, audiences: ['families', 'affluent'] }],
  ['Pan-India D2C established ₹2 Cr', { industry: 'fmcg-d2c', objective: 'sales', stage: 'established', region: PAN_INDIA, budgetINR: 20000000, months: 3, audiences: ['genz', 'urban-pros'] }],
  ['Gujarat solar B2B ₹8 L leads', { industry: 'renewable-energy', objective: 'leads', stage: 'growing', region: { scope: 'state', state: 'gj', zones: [], tiers: ['tier1', 'tier2'] }, budgetINR: 800000, months: 3, audiences: ['decision-makers'] }],
  ['Mumbai hospital ₹15 L awareness', { industry: 'healthcare', objective: 'awareness', stage: 'established', region: { scope: 'city', city: 'mumbai', zones: [], tiers: [] }, budgetINR: 1500000, months: 1, audiences: ['families'] }],
  ['Education in tier 2 and 3, North and Central, ₹12 L leads', { industry: 'education', objective: 'leads', stage: 'growing', region: { scope: 'zones', zones: ['north', 'central'], tiers: ['tier2', 'tier3Rural'] }, budgetINR: 1200000, months: 3, audiences: ['genz', 'bharat'] }],
  ['EV launch for Gen Z in metros ₹1.5 Cr', { industry: 'auto-ev', objective: 'launch', stage: 'new', region: { scope: 'pan-india', zones: [], tiers: ['metro'] }, budgetINR: 15000000, months: 3, audiences: ['genz'], include: ['influencers'] }],
  ['BFSI for affluent decision-makers ₹60 L, airport must-have', { industry: 'bfsi', objective: 'consideration', stage: 'established', region: { scope: 'zones', zones: ['west', 'south'], tiers: ['metro', 'tier1'] }, budgetINR: 6000000, months: 3, audiences: ['affluent', 'decision-makers'], include: ['airport'], exclude: ['bus-brts-auto'] }],
  ['Retail festive sales, Jaipur ₹25 L / 1 month', { industry: 'retail', objective: 'sales', stage: 'established', region: { scope: 'city', city: 'jaipur', zones: [], tiers: [] }, budgetINR: 2500000, months: 1, audiences: ['families'], exclude: ['television'] }],
  ['12-month always-on plan, Bengaluru ₹3 Cr', { industry: 'fmcg-d2c', objective: 'consideration', stage: 'growing', region: { scope: 'city', city: 'bengaluru', zones: [], tiers: [] }, budgetINR: 30000000, months: 12, audiences: ['urban-pros'] }],
  ['Relaunch across the South ₹5 Cr / 6 months', { industry: 'retail', objective: 'awareness', stage: 'relaunch', region: { scope: 'zones', zones: ['south'], tiers: [] }, budgetINR: 50000000, months: 6, audiences: ['families', 'sports-fans'] }],
  ['Default input', {}],
];

const CHANNEL_PERSONAS: [string, Partial<PlannerInput>][] = [
  ['Channels only: metro wraps + airport + social, Elevate', { mode: 'channels', channels: ['metro-wraps', 'airport', 'social-media'], objective: 'awareness', region: { scope: 'city', city: 'delhi', zones: [], tiers: [] } }],
  ['Channels only: pan-India TV + print + search for leads', { mode: 'channels', channels: ['television', 'print', 'search-performance'], objective: 'leads', industry: 'bfsi', region: PAN_INDIA, months: 6 }],
  ['Channels only: default selection', { mode: 'channels' }],
];

describe('planFromBudget personas', () => {
  for (const [name, over] of BUDGET_PERSONAS) {
    it(name, () => {
      const result = assertBudgetInvariants(make({ mode: 'budget', ...over }));
      expect(project(result)).toMatchSnapshot();
    });
  }

  it('gives real must-includes a place when they fit', () => {
    const ev = planFromBudget(make({ ...BUDGET_PERSONAS[5][1] }), channels);
    expect(ev.lines.map((l) => l.slug)).toContain('influencers');
    const bfsi = planFromBudget(make({ ...BUDGET_PERSONAS[6][1] }), channels);
    expect(bfsi.lines.map((l) => l.slug)).toContain('airport');
    expect(bfsi.lines.map((l) => l.slug)).not.toContain('bus-brts-auto');
  });

  it('holds the invariants across a grid of inputs', () => {
    const budgets = [100000, 250000, 499000, 500000, 1001000, 2500000, 7500000, 10000000, 40000000, 100000000];
    const regions: PlannerInput['region'][] = [
      DEFAULT_INPUT.region,
      { scope: 'state', state: 'up', zones: [], tiers: [] },
      { scope: 'zones', zones: ['east', 'north-east'], tiers: ['tier2'] },
      PAN_INDIA,
    ];
    const objectives: PlannerInput['objective'][] = ['awareness', 'leads', 'sales', 'launch', 'consideration'];
    let n = 0;
    for (const budgetINR of budgets) {
      for (const months of [1, 3, 6, 12] as const) {
        const region = regions[n % regions.length];
        const objective = objectives[n % objectives.length];
        const stage = STAGE_IDS[n % STAGE_IDS.length];
        const include = n % 3 === 0 ? [ALL_SLUGS[n % 18]] : [];
        const exclude = n % 4 === 0 ? [ALL_SLUGS[(n + 5) % 18], ALL_SLUGS[(n + 11) % 18]] : [];
        assertBudgetInvariants(make({ budgetINR, months, region, objective, stage, include, exclude }));
        n++;
      }
    }
    expect(n).toBe(40);
  });
});

describe('planFromChannels personas', () => {
  for (const [name, over] of CHANNEL_PERSONAS) {
    it(name, () => {
      const result = assertChannelsInvariants(make(over));
      expect(project(result)).toMatchSnapshot();
    });
  }

  it('follows the Mode B formula for a single city', () => {
    const result = planFromChannels(make({ mode: 'channels', channels: ['metro-wraps', 'airport', 'social-media'], months: 3 }), channels);
    const elevate = result.scenarios[1];
    for (const l of elevate.lines) {
      const min = bySlug.get(l.slug)!.costs.minMonthlyINR;
      expect(l.spendINR).toBe(Math.round((min * 3 * 2.5 * 1.3) / 1000) * 1000);
    }
    expect(elevate.totalRange.low).toBe(Math.round((elevate.totalINR * 0.85) / 1000) * 1000);
    expect(elevate.totalRange.high).toBe(Math.round((elevate.totalINR * 1.2) / 1000) * 1000);
    expect(result.kpiLine).toMatch(/^At Elevate intensity: /);
  });

  it('scales physical inventory harder than digital as geography widens', () => {
    const city = planFromChannels(make({ mode: 'channels', channels: ['hoardings', 'social-media'] }), channels);
    const india = planFromChannels(make({ mode: 'channels', channels: ['hoardings', 'social-media'], region: { scope: 'pan-india', zones: [], tiers: ['metro'] } }), channels);
    const ratio = (slug: string) =>
      india.scenarios[0].lines.find((l) => l.slug === slug)!.spendINR / city.scenarios[0].lines.find((l) => l.slug === slug)!.spendINR;
    expect(ratio('hoardings')).toBeGreaterThan(ratio('social-media'));
    expect(ratio('social-media')).toBeGreaterThan(1);
  });
});

describe('edge cases', () => {
  it('tiny budget: ₹1 L for 1 month', () => {
    const result = assertBudgetInvariants(make({ budgetINR: 100000, months: 1 }));
    expect(result.lines.length).toBeGreaterThanOrEqual(1);
    expect(result.lines.length).toBeLessThanOrEqual(3);
    expect(result.warnings.some((w) => w.includes(FALLBACK_WARNING))).toBe(false);
    expect(project(result)).toMatchSnapshot();
  });

  it('tiny budget: ₹1 L for 12 months falls back to one channel with a warning', () => {
    const result = assertBudgetInvariants(make({ budgetINR: 100000, months: 12, include: ['airport'] }));
    expect(result.lines).toHaveLength(1);
    expect(result.lines[0].sharePct).toBe(100);
    expect(result.lines[0].spendINR).toBe(100000);
    expect(result.warnings.some((w) => w.includes(FALLBACK_WARNING))).toBe(true);
    expect(result.warnings.some((w) => w.includes(bySlug.get('airport')!.name))).toBe(true);
    const lowestMin = Math.min(...channels.map((c) => c.costs.minMonthlyINR));
    expect(bySlug.get(result.lines[0].slug)!.costs.minMonthlyINR).toBe(lowestMin);
    expect(project(result)).toMatchSnapshot();
  });

  it('a single allowed channel takes 100%', () => {
    const exclude = ALL_SLUGS.filter((s) => s !== 'hoardings');
    const result = assertBudgetInvariants(make({ budgetINR: 2500000, exclude, objective: 'awareness' }));
    expect(result.lines.map((l) => l.slug)).toEqual(['hoardings']);
    expect(result.lines[0].sharePct).toBe(100);
    expect(result.lines[0].spendINR).toBe(2500000);
    expect(result.alsoConsider).toEqual([]);

    const leads = assertBudgetInvariants(make({ budgetINR: 2500000, exclude, objective: 'leads' }));
    expect(leads.lines.map((l) => l.slug)).toEqual(['hoardings']);
    expect(leads.totals.leads).toBeUndefined();
    expect(leads.warnings.some((w) => w.includes('leads cannot be estimated'))).toBe(true);
  });

  it('every channel excluded returns an empty plan and a warning', () => {
    const result = planFromBudget(make({ exclude: ALL_SLUGS, include: ['airport'] }), channels);
    expect(result.lines).toEqual([]);
    expect(result.totalINR).toBe(0);
    expect(result.totals).toEqual({ impressions: { low: 0, high: 0 }, reach: { low: 0, high: 0 } });
    expect(result.alsoConsider).toEqual([]);
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings[0]).toMatch(/excluded/);
    expect(() => planSummaryText(result, { brandName: 'Demo' })).not.toThrow();
    expect(() => planFromBudget(make({}), [])).not.toThrow();
    expect(planFromBudget(make({}), []).lines).toEqual([]);
  });

  it('clamps budgets outside the limits', () => {
    const high = assertBudgetInvariants(make({ budgetINR: 5000000000, region: PAN_INDIA, objective: 'awareness' }));
    expect(high.totalINR).toBe(BUDGET_LIMITS.max);
    expect(high.warnings.some((w) => w.includes('₹10 Cr'))).toBe(true);
    expect(high.lines.length).toBeGreaterThanOrEqual(5);
    expect(high.lines.length).toBeLessThanOrEqual(9);

    const low = assertBudgetInvariants(make({ budgetINR: 5, months: 1 }));
    expect(low.totalINR).toBe(BUDGET_LIMITS.min);
    const nan = planFromBudget(make({ budgetINR: Number.NaN, months: 1 }), channels);
    expect(nan.totalINR).toBe(BUDGET_LIMITS.min);
  });

  it('warns when a must-include cannot fit, and ignores unknown or conflicting requests', () => {
    const result = assertBudgetInvariants(make({ budgetINR: 800000, months: 6, include: ['airport', 'not-a-channel', 'radio'], exclude: ['radio'] }));
    const slugs = result.lines.map((l) => l.slug);
    expect(slugs).not.toContain('airport');
    expect(slugs).not.toContain('radio');
    expect(result.warnings.some((w) => w.includes('Airport'))).toBe(true);
    expect(result.warnings.some((w) => w.includes('not-a-channel'))).toBe(true);
    expect(result.warnings.some((w) => w.includes('must-include and exclude'))).toBe(true);
  });

  it('adds a trackable channel for leads even when the user forces other channels', () => {
    const result = assertBudgetInvariants(make({ budgetINR: 3000000, objective: 'leads', include: ['hoardings', 'print'] }));
    const slugs = result.lines.map((l) => l.slug);
    expect(slugs).toContain('hoardings');
    expect(slugs).toContain('print');
    expect(slugs.some((s) => TRACKABLE_DIGITAL_SLUGS.includes(s))).toBe(true);
  });

  it('warns when the budget is thin for a wide geography', () => {
    const thin = planFromBudget(make({ budgetINR: 1000000, region: PAN_INDIA }), channels);
    expect(thin.warnings.some((w) => w.includes('looks thin'))).toBe(true);
    const city = planFromBudget(make({ budgetINR: 1000000 }), channels);
    expect(city.warnings.some((w) => w.includes('looks thin'))).toBe(false);
  });

  it('Mode B: an empty selection returns three empty scenarios and a warning', () => {
    const result = assertChannelsInvariants(make({ mode: 'channels', channels: [] }));
    expect(result.scenarios).toHaveLength(3);
    for (const s of result.scenarios) {
      expect(s.lines).toEqual([]);
      expect(s.totalINR).toBe(0);
    }
    expect(result.warnings.some((w) => w.includes('No channels are selected'))).toBe(true);
    expect(result.alsoConsider).toEqual([]);
  });

  it('Mode B: unknown slugs are ignored with a warning, duplicates count once', () => {
    const result = assertChannelsInvariants(make({ mode: 'channels', channels: ['hoardings', 'teleportation', 'hoardings'] }));
    expect(result.scenarios[0].lines.map((l) => l.slug)).toEqual(['hoardings']);
    expect(result.warnings.some((w) => w.includes('teleportation'))).toBe(true);
    const allUnknown = planFromChannels(make({ mode: 'channels', channels: ['x', 'y'] }), channels);
    expect(allUnknown.scenarios[0].lines).toEqual([]);
    expect(allUnknown.warnings.length).toBe(3);
  });

  it('Mode B: leads objective without a trackable channel warns', () => {
    const result = planFromChannels(make({ mode: 'channels', channels: ['hoardings'], objective: 'leads' }), channels);
    expect(result.warnings.some((w) => w.includes('leads cannot be estimated'))).toBe(true);
    expect(result.scenarios[0].totals.leads).toBeUndefined();
  });

  it('does not mutate the input', () => {
    const input = make({ include: ['airport'], exclude: ['radio'], audiences: ['genz'] });
    const copy = JSON.parse(JSON.stringify(input));
    plan(input, channels);
    plan({ ...input, mode: 'channels' }, channels);
    expect(input).toEqual(copy);
  });
});

describe('summary', () => {
  it('describes inputs for both modes', () => {
    const rows = describeInput(make({ include: ['airport'], audiences: ['genz', 'families'] }), channels);
    expect(rows.map((r) => r.label)).toEqual(['Industry', 'Objective', 'Brand stage', 'Region', 'Audiences', 'Duration', 'Budget', 'Must include']);
    expect(rows.find((r) => r.label === 'Budget')!.value).toBe('₹25 L');
    expect(rows.find((r) => r.label === 'Region')!.value).toBe('Ahmedabad (Metro)');
    expect(rows.find((r) => r.label === 'Duration')!.value).toBe('3 months');
    expect(rows.find((r) => r.label === 'Must include')!.value).toBe(bySlug.get('airport')!.name);

    const b = describeInput(make({ mode: 'channels', region: { scope: 'zones', zones: ['north', 'west'], tiers: ['metro', 'tier1'] }, months: 1 }));
    expect(b.find((r) => r.label === 'Region')!.value).toBe('North and West zones (Metro and Tier 1)');
    expect(b.find((r) => r.label === 'Duration')!.value).toBe('1 month');
    expect(b.find((r) => r.label === 'Channels')!.value).toBe('Hoardings, Social Media, Search Performance');
    expect(describeInput(make({ region: PAN_INDIA })).find((r) => r.label === 'Region')!.value).toBe('Pan-India (all tiers)');
  });

  it('writes a short WhatsApp summary', () => {
    const budget = plan(DEFAULT_INPUT, channels) as BudgetPlan;
    const text = planSummaryText(budget, { brandName: 'Demo Agency', url: 'https://example.com/planner?budget=4000000' });
    expect(text).toContain('Demo Agency media plan');
    expect(text).toContain('Budget ₹25 L');
    expect(text).toContain(budget.kpiLine);
    expect(text).toContain('Indicative estimate');
    expect(text.endsWith('https://example.com/planner?budget=4000000')).toBe(true);
    expect(text.length).toBeLessThan(900);
    expect(planSummaryText(budget, { brandName: 'Demo Agency' })).not.toContain('View the plan');

    const all = plan(make({ mode: 'channels', channels: ALL_SLUGS, region: PAN_INDIA }), channels) as ChannelsPlan;
    const long = planSummaryText(all, { brandName: 'Demo Agency' });
    expect(long).toContain('and 12 more');
    expect(long).toMatch(/Launch: ₹.*\nElevate: ₹.*\nDominate: ₹/);
    expect(long.length).toBeLessThan(900);
  });
});
