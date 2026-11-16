'use client';
import { useState } from 'react';
import { copy } from '@/brand/copy';
import { Glyph } from '@/components/glyphs/Glyph';
import { TLink } from '@/components/providers/Transition';
import { cn } from '@/lib/cn';
import { formatCountCompact, formatCountRange, formatINRCompact, formatINRRange } from '@/lib/format-inr';
import type { BudgetPlan, ChannelsPlan, IntensityId, PlanResult } from '@/lib/planner';
import type { ChannelLite } from '@/lib/types';
import dynamic from 'next/dynamic';
import { MIX_COLORS } from './mix-colors';

// Recharts loads on demand (BRIEF §7.6).
const Donut = dynamic(() => import('./Donut').then((m) => m.Donut), {
  ssr: false,
  loading: () => <div className="mx-auto aspect-square w-[200px] rounded-full border-[28px] border-line" />,
});
import { Tween } from './Tween';

export function EstimateBadge() {
  return (
    <p className="mono flex flex-wrap items-center gap-2 !text-[10.5px] text-ink-60">
      <span className="rounded-full bg-brand-100 px-2.5 py-1 text-ink">{copy.plannerBadge}</span>
      <TLink href="/planner-methodology" className="underline decoration-brand underline-offset-4 hover:text-ink">
        {copy.plannerBadgeLink}
      </TLink>
    </p>
  );
}

function Warnings({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul className="space-y-2" aria-live="polite">
      {items.map((w) => (
        <li key={w} className="rounded-2xl bg-mist px-4 py-3 text-[13px] leading-relaxed text-ink-60">
          {w}
        </li>
      ))}
    </ul>
  );
}

function Headline({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-paper p-4">
      <p className="mono !text-[10px] text-ink-60">{label}</p>
      <p className="display mt-1.5 text-[1.3rem] font-semibold leading-tight">{value}</p>
    </div>
  );
}

function Suggestions({ plan }: { plan: PlanResult }) {
  if (!plan.alsoConsider.length) return null;
  return (
    <div>
      <p className="mono mb-3 text-ink-60">Channels we’d add</p>
      <ul className="space-y-2">
        {plan.alsoConsider.map((s) => (
          <li key={s.slug}>
            <TLink href={`/channels/${s.slug}`} className="flex flex-col rounded-2xl border border-line bg-paper px-4 py-3 transition-colors hover:border-ink">
              <span className="text-[14px] font-semibold">{s.name}</span>
              <span className="text-[13px] text-ink-60">{s.why}</span>
            </TLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BudgetResults({ plan, compact }: { plan: BudgetPlan; compact?: boolean }) {
  const t = plan.totals;
  return (
    <div className="flex flex-col gap-6" data-testid="budget-results">
      <div className={cn('grid items-center gap-6', compact ? 'sm:grid-cols-[200px_1fr]' : 'sm:grid-cols-[240px_1fr]')}>
        <Donut size={compact ? 200 : 240} data={plan.lines.map((l) => ({ name: l.shortName, value: l.spendINR }))} centreLabel="Total" centreValue={formatINRCompact(plan.totalINR)} />
        <div className="grid gap-3">
          <Headline label="Impressions" value={<Tween value={t.impressions.high} format={(v) => `${formatCountCompact(t.impressions.low * (v / Math.max(1, t.impressions.high)))} to ${formatCountCompact(v)}`} />} />
          <Headline label="Estimated reach" value={formatCountRange(t.reach.low, t.reach.high)} />
          <Headline label={t.leads ? 'Estimated leads' : 'Channels'} value={t.leads ? formatCountRange(t.leads.low, t.leads.high) : `${plan.lines.length} in the mix`} />
        </div>
      </div>
      <p className="rounded-2xl bg-ink px-5 py-4 text-[15px] leading-relaxed text-paper" data-testid="kpi-line">
        {plan.kpiLine}
      </p>
      <Warnings items={plan.warnings} />
      {plan.lines.length ? (
        <div className="overflow-x-auto">
          <table className={cn('w-full text-left text-[14px]', !compact && 'min-w-[520px]')}>
            <caption className="sr-only">Recommended channel mix</caption>
            <thead>
              <tr className="mono border-b border-line text-ink-60">
                <th className="py-2 font-normal">Channel</th>
                <th className="py-2 text-right font-normal">Share</th>
                <th className="py-2 text-right font-normal">Spend</th>
                {compact ? null : <th className="py-2 pl-4 text-right font-normal">Impressions</th>}
              </tr>
            </thead>
            <tbody>
              {plan.lines.map((l, i) => (
                <tr key={l.slug} className="border-b border-line align-top" data-testid="mix-line">
                  <td className="py-3 pr-3">
                    <span className="flex items-start gap-2.5">
                      <span className="mt-1.5 size-2.5 shrink-0 rounded-full" style={{ background: MIX_COLORS[i % MIX_COLORS.length] }} aria-hidden />
                      <span>
                        <span className="block font-semibold">{l.name}</span>
                        {compact ? null : (
                          <span className="block text-[13px] text-ink-60">
                            <span className="text-ink">{l.role}.</span> {l.why}
                          </span>
                        )}
                      </span>
                    </span>
                  </td>
                  <td className="py-3 text-right font-medium tabular-nums">
                    <Tween value={l.sharePct} format={(v) => `${v.toFixed(1)}%`} />
                  </td>
                  <td className="py-3 text-right font-medium tabular-nums">
                    <Tween value={l.spendINR} format={formatINRCompact} />
                  </td>
                  {compact ? null : <td className="py-3 pl-4 text-right text-ink-60 tabular-nums">{formatCountRange(l.impressions.low, l.impressions.high)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {compact ? null : <Suggestions plan={plan} />}
    </div>
  );
}

export function ChannelsResults({ plan, compact, channels }: { plan: ChannelsPlan; compact?: boolean; channels: ChannelLite[] }) {
  const [picked, setPicked] = useState<IntensityId>('elevate');
  const scenario = plan.scenarios.find((s) => s.id === picked) ?? plan.scenarios[0];
  const glyphOf = (slug: string) => channels.find((c) => c.slug === slug)?.glyph;
  return (
    <div className="flex flex-col gap-6" data-testid="channels-results">
      <div className={cn('grid gap-3', compact ? 'grid-cols-3' : 'sm:grid-cols-3')} role="radiogroup" aria-label="Intensity">
        {plan.scenarios.map((s) => (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={picked === s.id}
            onClick={() => setPicked(s.id)}
            className={cn('flex flex-col rounded-[22px] p-4 text-left transition-colors duration-300 sm:p-5', picked === s.id ? 'bg-brand text-on-brand' : 'bg-paper hover:bg-mist')}
            data-testid="scenario"
          >
            <span className="mono !text-[10px] opacity-80">{s.label}</span>
            <span className="display mt-2 text-[1.35rem] font-semibold leading-tight sm:text-[1.6rem]">
              <Tween value={s.totalINR} format={formatINRCompact} />
            </span>
            {compact ? null : <span className="mt-1 text-[12.5px] opacity-80">{formatINRRange(s.totalRange.low, s.totalRange.high)}</span>}
          </button>
        ))}
      </div>
      {scenario ? (
        <>
          {compact ? null : <p className="text-[14px] leading-relaxed text-ink-60">{scenario.blurb}</p>}
          <div className="grid gap-3 sm:grid-cols-2">
            <Headline label="Impressions" value={formatCountRange(scenario.totals.impressions.low, scenario.totals.impressions.high)} />
            <Headline label="Estimated reach" value={formatCountRange(scenario.totals.reach.low, scenario.totals.reach.high)} />
            {scenario.totals.leads ? <Headline label="Estimated leads" value={formatCountRange(scenario.totals.leads.low, scenario.totals.leads.high)} /> : null}
          </div>
          {scenario.lines.length ? (
            <ul className="divide-y divide-line rounded-[22px] bg-paper px-4">
              {scenario.lines.map((l) => {
                const g = glyphOf(l.slug);
                return (
                  <li key={l.slug} className="flex items-center gap-3 py-3" data-testid="scenario-line">
                    {g ? (
                      <span className="size-9 shrink-0">
                        <Glyph id={g} size={36} />
                      </span>
                    ) : null}
                    <span className="flex-1">
                      <span className="block text-[14px] font-semibold">{l.name}</span>
                      {compact ? null : <span className="block text-[12.5px] text-ink-60">{formatCountRange(l.impressions.low, l.impressions.high)} impressions</span>}
                    </span>
                    <span className="font-medium tabular-nums">
                      <Tween value={l.spendINR} format={formatINRCompact} />
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </>
      ) : null}
      <p className="rounded-2xl bg-ink px-5 py-4 text-[15px] leading-relaxed text-paper" data-testid="kpi-line">
        {plan.kpiLine}
      </p>
      <Warnings items={plan.warnings} />
      {compact ? null : <Suggestions plan={plan} />}
    </div>
  );
}
