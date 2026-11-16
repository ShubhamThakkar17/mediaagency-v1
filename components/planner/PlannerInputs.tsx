'use client';
import { AUDIENCES } from '@/data/audiences';
import { CITIES } from '@/data/cities';
import { INDUSTRIES } from '@/data/industries';
import { DURATIONS, OBJECTIVES, STAGES } from '@/data/objectives';
import { STATES, TIERS, ZONES, type TierId, type ZoneId } from '@/data/regions';
import type { PlannerInput, RegionScope } from '@/lib/planner';
import { ChipToggle, Field, Segmented, Select } from './fields';

const SCOPES: { value: RegionScope; label: string }[] = [
  { value: 'city', label: 'City' },
  { value: 'state', label: 'State' },
  { value: 'zones', label: 'Zones' },
  { value: 'pan-india', label: 'Pan-India' },
];

const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

export function SharedInputs({ input, update, compact }: { input: PlannerInput; update: (p: Partial<PlannerInput>) => void; compact?: boolean }) {
  const r = input.region;
  const setRegion = (p: Partial<PlannerInput['region']>) => update({ region: { ...r, ...p } });
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Industry" htmlFor="pl-industry">
        <Select id="pl-industry" value={input.industry} onChange={(v) => update({ industry: v })} options={INDUSTRIES.map((i) => ({ value: i.id, label: i.label }))} />
      </Field>
      <Field label="Objective" htmlFor="pl-objective">
        <Select id="pl-objective" value={input.objective} onChange={(v) => update({ objective: v })} options={OBJECTIVES.map((o) => ({ value: o.id, label: o.label }))} />
      </Field>
      {compact ? null : (
        <>
          <Field label="Brand stage" htmlFor="pl-stage">
            <Select id="pl-stage" value={input.stage} onChange={(v) => update({ stage: v })} options={STAGES.map((s) => ({ value: s.id, label: s.label }))} />
          </Field>
          <Field label="Duration">
            <Segmented label="Duration" value={input.months} onChange={(v) => update({ months: v })} options={DURATIONS.map((d) => ({ value: d, label: d === 1 ? '1 mo' : `${d} mo` }))} />
          </Field>
          <div className="flex flex-col gap-3 sm:col-span-2">
            <span className="mono text-ink-60">Where</span>
            <Segmented label="Region scope" value={r.scope} onChange={(scope) => setRegion({ scope })} options={SCOPES} />
            {r.scope === 'city' ? (
              <Select value={r.city ?? 'ahmedabad'} onChange={(city) => setRegion({ city })} options={CITIES.map((c) => ({ value: c.id, label: c.name }))} />
            ) : null}
            {r.scope === 'state' ? (
              <Select value={r.state ?? 'gj'} onChange={(state) => setRegion({ state })} options={[...STATES].sort((a, b) => a.name.localeCompare(b.name)).map((s) => ({ value: s.id, label: s.name }))} />
            ) : null}
            {r.scope === 'zones' ? (
              <div className="flex flex-wrap gap-2" role="group" aria-label="Zones">
                {ZONES.map((z) => (
                  <ChipToggle key={z.id} pressed={r.zones.includes(z.id)} onClick={() => setRegion({ zones: toggle<ZoneId>(r.zones, z.id) })}>
                    {z.label}
                  </ChipToggle>
                ))}
              </div>
            ) : null}
            {r.scope !== 'city' ? (
              <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Market tiers">
                <span className="text-xs text-ink-60">Tiers:</span>
                {TIERS.map((t) => (
                  <ChipToggle key={t.id} pressed={r.tiers.includes(t.id)} onClick={() => setRegion({ tiers: toggle<TierId>(r.tiers, t.id) })}>
                    {t.label}
                  </ChipToggle>
                ))}
                <span className="text-xs text-ink-60">{r.tiers.length ? '' : '(all tiers)'}</span>
              </div>
            ) : null}
          </div>
          <div className="flex flex-col gap-3 sm:col-span-2">
            <span className="mono text-ink-60">Audiences (optional)</span>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Audiences">
              {AUDIENCES.map((a) => (
                <ChipToggle key={a.id} pressed={input.audiences.includes(a.id)} onClick={() => update({ audiences: toggle(input.audiences, a.id) })}>
                  {a.label}
                </ChipToggle>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
