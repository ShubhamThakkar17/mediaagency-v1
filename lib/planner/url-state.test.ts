import { describe, expect, it } from 'vitest';
import { BUDGET_LIMITS } from '@/data/planner-weights';
import { DEFAULT_INPUT, decodeState, encodeState, normalizeInput } from './url-state';
import type { PlannerInput } from './types';

const roundTrip = (x: PlannerInput) => decodeState(new URLSearchParams(encodeState(x)));

describe('url-state', () => {
  it('encodes the default input as an empty string and decodes nothing as the default', () => {
    expect(encodeState(DEFAULT_INPUT)).toBe('');
    expect(decodeState(new URLSearchParams(''))).toEqual(DEFAULT_INPUT);
    expect(decodeState({})).toEqual(DEFAULT_INPUT);
    expect(decodeState(undefined)).toEqual(DEFAULT_INPUT);
    expect(normalizeInput(DEFAULT_INPUT)).toEqual(DEFAULT_INPUT);
  });

  it('handles /planner?mode=budget&include=airport', () => {
    const fromUsp = decodeState(new URLSearchParams('mode=budget&include=airport'));
    expect(fromUsp).toEqual({ ...DEFAULT_INPUT, include: ['airport'] });
    expect(decodeState({ mode: 'budget', include: 'airport' })).toEqual(fromUsp);
    expect(encodeState(fromUsp)).toBe('include=airport');
  });

  const cases: [string, PlannerInput][] = [
    ['default', DEFAULT_INPUT],
    ['channels mode', { ...DEFAULT_INPUT, mode: 'channels', channels: ['metro-wraps', 'airport', 'social-media'] }],
    ['empty channel selection', { ...DEFAULT_INPUT, mode: 'channels', channels: [] }],
    ['another city', { ...DEFAULT_INPUT, region: { scope: 'city', city: 'mumbai', zones: [], tiers: [] } }],
    ['state with tiers', { ...DEFAULT_INPUT, region: { scope: 'state', state: 'gj', zones: [], tiers: ['tier1', 'tier2'] } }],
    ['zones', { ...DEFAULT_INPUT, region: { scope: 'zones', zones: ['north', 'north-east'], tiers: ['metro'] } }],
    ['zones, none picked yet', { ...DEFAULT_INPUT, region: { scope: 'zones', zones: [], tiers: [] } }],
    ['pan-India', { ...DEFAULT_INPUT, region: { scope: 'pan-india', zones: [], tiers: ['tier3Rural'] } }],
    [
      'everything changed',
      {
        mode: 'budget',
        industry: 'fmcg-d2c',
        objective: 'launch',
        stage: 'relaunch',
        region: { scope: 'pan-india', zones: [], tiers: [] },
        audiences: ['genz', 'sports-fans'],
        months: 12,
        budgetINR: 12500000,
        include: ['television', 'influencers'],
        exclude: ['print'],
        channels: ['radio'],
      },
    ],
  ];
  for (const [name, input] of cases) {
    it(`round trips: ${name}`, () => {
      expect(roundTrip(input)).toEqual(normalizeInput(input));
      expect(normalizeInput(input)).toEqual(input);
      // Encoding is stable.
      expect(encodeState(roundTrip(input))).toBe(encodeState(input));
    });
  }

  it('round trips a messy input to its normalised form', () => {
    const messy = {
      ...DEFAULT_INPUT,
      budgetINR: 2512345,
      audiences: ['families', 'genz', 'families'],
      include: ['airport', 'airport', 'radio', 'nope'],
      exclude: ['radio'],
      region: { scope: 'state', state: 'mh', city: 'pune', zones: ['west'], tiers: ['tier2', 'metro', 'metro'] },
    } as PlannerInput;
    const clean = normalizeInput(messy);
    expect(clean.budgetINR).toBe(2512000);
    expect(clean.audiences).toEqual(['genz', 'families']);
    expect(clean.include).toEqual(['airport']);
    expect(clean.exclude).toEqual(['radio']);
    expect(clean.region).toEqual({ scope: 'state', state: 'mh', zones: [], tiers: ['metro', 'tier2'] });
    expect(roundTrip(messy)).toEqual(clean);
  });

  it('uses the documented parameter names', () => {
    const qs = encodeState({
      mode: 'channels',
      industry: 'bfsi',
      objective: 'sales',
      stage: 'new',
      region: { scope: 'zones', zones: ['north', 'west'], tiers: ['metro', 'tier1'] },
      audiences: ['affluent', 'decision-makers'],
      months: 6,
      budgetINR: 5000000,
      include: ['airport'],
      exclude: ['radio', 'print'],
      channels: ['airport', 'airline'],
    });
    expect(qs).toBe(
      'mode=channels&industry=bfsi&objective=sales&stage=new&scope=zones&zones=north,west&tiers=metro,tier1&audiences=decision-makers,affluent&months=6&budget=5000000&include=airport&exclude=radio,print&channels=airport,airline',
    );
    expect(qs.startsWith('?')).toBe(false);
    expect(encodeState({ ...DEFAULT_INPUT, region: { scope: 'state', state: 'gj', zones: [], tiers: [] } })).toBe('scope=state&state=gj');
    expect(encodeState({ ...DEFAULT_INPUT, region: { scope: 'city', city: 'pune', zones: [], tiers: [] } })).toBe('city=pune');
    expect(encodeState({ ...DEFAULT_INPUT, channels: [] })).toBe('channels=');
  });

  it('falls back field by field on garbage', () => {
    const garbage = decodeState(
      new URLSearchParams(
        'mode=hack&industry=<script>&objective=&stage=42&scope=moon&city=atlantis&zones=north,narnia&tiers=gold&audiences=robots,genz,genz&months=7&budget=lots&include=airport,%00,airport&exclude=,,&channels=%%%',
      ),
    );
    expect(garbage).toEqual({ ...DEFAULT_INPUT, audiences: ['genz'], include: ['airport'] });
  });

  it('clamps and parses budgets', () => {
    expect(decodeState({ budget: '5' }).budgetINR).toBe(BUDGET_LIMITS.min);
    expect(decodeState({ budget: '99999999999' }).budgetINR).toBe(BUDGET_LIMITS.max);
    expect(decodeState({ budget: '40L' }).budgetINR).toBe(4000000);
    expect(decodeState({ budget: '1.25cr' }).budgetINR).toBe(12500000);
    expect(decodeState({ budget: '-100' }).budgetINR).toBe(DEFAULT_INPUT.budgetINR);
    expect(decodeState({ budget: '1234567' }).budgetINR).toBe(1235000);
  });

  it('infers the scope and accepts Next.js style records', () => {
    expect(decodeState({ state: 'gj', tiers: 'tier2,tier1' }).region).toEqual({ scope: 'state', state: 'gj', zones: [], tiers: ['tier1', 'tier2'] });
    expect(decodeState({ zones: ['south', 'east'] }).region).toEqual({ scope: 'zones', zones: ['south', 'east'], tiers: [] });
    expect(decodeState({ scope: 'pan-india', city: 'mumbai' }).region).toEqual({ scope: 'pan-india', zones: [], tiers: [] });
    expect(decodeState({ scope: 'state', state: 'zz' }).region).toEqual(DEFAULT_INPUT.region);
    expect(decodeState({ include: ['airport', 'radio,airport'], exclude: undefined }).include).toEqual(['airport', 'radio']);
    expect(decodeState({ include: 'airport', exclude: 'airport' })).toMatchObject({ include: [], exclude: ['airport'] });
    expect(decodeState({ channels: '' }).channels).toEqual([]);
    expect(decodeState({ channels: 'bogus' }).channels).toEqual(DEFAULT_INPUT.channels);
    expect(decodeState({ channels: 'custom-channel' }, { slugs: ['custom-channel'] }).channels).toEqual(['custom-channel']);
  });

  it('never returns the default arrays by reference', () => {
    const a = decodeState({});
    a.channels.push('radio');
    a.region.zones.push('north');
    expect(decodeState({})).toEqual(DEFAULT_INPUT);
    expect(DEFAULT_INPUT.channels).toHaveLength(3);
  });
});
