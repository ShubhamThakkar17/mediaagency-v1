/**
 * Plain-text views of a plan: the WhatsApp summary and the input rows used
 * by the PDF and the results panel. Pure functions.
 */
import { audienceLabel } from '@/data/audiences';
import { cityById } from '@/data/cities';
import { industryLabel } from '@/data/industries';
import { objectiveLabel, stageLabel } from '@/data/objectives';
import { TIER_IDS, ZONE_IDS, stateById, tierLabel, zoneLabel } from '@/data/regions';
import { formatINRCompact, formatINRRange } from '@/lib/format-inr';
import type { PlanResult, PlannerInput } from './types';

type NamedChannel = { slug: string; name: string; shortName?: string };

function joinList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

function titleFromSlug(slug: string) {
  return slug
    .split('-')
    .map((w) => (w.length <= 3 && w !== 'bus' ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');
}

function durationText(months: number) {
  return months === 1 ? '1 month' : `${months} months`;
}

/** "Ahmedabad", "Gujarat (Tier 1 and Tier 2)", "North and West zones (all tiers)", "Pan-India (all tiers)". */
export function regionText(input: PlannerInput): string {
  const r = input.region;
  if (r.scope === 'city') {
    const city = r.city ? cityById(r.city) : undefined;
    if (city) return `${city.name} (${tierLabel(city.tier)})`;
  }
  const tiers = TIER_IDS.filter((t) => r.tiers.includes(t));
  const tierText = tiers.length === 0 || tiers.length === TIER_IDS.length ? 'all tiers' : joinList(tiers.map((t) => tierLabel(t)));
  if (r.scope === 'state') {
    const state = r.state ? stateById(r.state) : undefined;
    if (state) return `${state.name} (${tierText})`;
  }
  if (r.scope === 'zones') {
    const zones = ZONE_IDS.filter((z) => r.zones.includes(z));
    if (zones.length > 0 && zones.length < ZONE_IDS.length) {
      return `${joinList(zones.map((z) => zoneLabel(z)))} ${zones.length === 1 ? 'zone' : 'zones'} (${tierText})`;
    }
  }
  return `Pan-India (${tierText})`;
}

/**
 * Human-readable input rows. Pass the channel list to show channel names
 * instead of names derived from slugs.
 */
export function describeInput(input: PlannerInput, channels: NamedChannel[] = []): { label: string; value: string }[] {
  const nameOf = (slug: string) => channels.find((c) => c.slug === slug)?.name ?? titleFromSlug(slug);
  const rows = [
    { label: 'Industry', value: industryLabel(input.industry) },
    { label: 'Objective', value: objectiveLabel(input.objective) },
    { label: 'Brand stage', value: stageLabel(input.stage) },
    { label: 'Region', value: regionText(input) },
    { label: 'Audiences', value: input.audiences.length ? input.audiences.map((a) => audienceLabel(a)).join(', ') : 'All audiences' },
    { label: 'Duration', value: durationText(input.months) },
  ];
  if (input.mode === 'budget') {
    rows.push({ label: 'Budget', value: formatINRCompact(input.budgetINR) });
    if (input.include.length) rows.push({ label: 'Must include', value: input.include.map(nameOf).join(', ') });
    if (input.exclude.length) rows.push({ label: 'Exclude', value: input.exclude.map(nameOf).join(', ') });
  } else {
    rows.push({ label: 'Channels', value: input.channels.length ? input.channels.map(nameOf).join(', ') : 'None selected' });
  }
  return rows;
}

const MAX_NAMED_CHANNELS = 6;

/** Short plain-text summary for WhatsApp. Stays under about 900 characters before the link. */
export function planSummaryText(result: PlanResult, opts: { brandName: string; url?: string }): string {
  const input = result.input;
  const out: string[] = [];
  out.push(`${opts.brandName} media plan (indicative)`);
  out.push(`${industryLabel(input.industry)} · ${objectiveLabel(input.objective)} · ${stageLabel(input.stage)}`);

  if (result.mode === 'budget') {
    out.push(`${regionText(input)} · ${durationText(result.months)} · Budget ${formatINRCompact(result.totalINR || input.budgetINR)}`);
    out.push('');
    if (result.lines.length) {
      out.push('Recommended mix:');
      result.lines.forEach((l, i) => out.push(`${i + 1}. ${l.shortName}: ${l.sharePct}% (${formatINRCompact(l.spendINR)})`));
    } else {
      out.push('No channels in the plan yet.');
    }
  } else {
    out.push(`${regionText(input)} · ${durationText(result.months)}`);
    out.push('');
    const names = (result.scenarios[0]?.lines ?? []).map((l) => l.shortName);
    if (names.length) {
      const shown = names.slice(0, MAX_NAMED_CHANNELS);
      const more = names.length - shown.length;
      out.push(`Channels: ${shown.join(', ')}${more > 0 ? ` and ${more} more` : ''}`);
      for (const s of result.scenarios) {
        out.push(`${s.label}: ${formatINRCompact(s.totalINR)} (${formatINRRange(s.totalRange.low, s.totalRange.high)})`);
      }
    } else {
      out.push('No channels selected yet.');
    }
  }

  out.push('');
  out.push(`${result.kpiLine}.`);
  out.push('Indicative estimate based on planning assumptions, not a quote.');
  if (opts.url) out.push(`View the plan: ${opts.url}`);
  return out.join('\n');
}
