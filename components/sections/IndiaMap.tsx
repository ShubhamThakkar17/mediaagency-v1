'use client';
import { useMemo, useRef, useState } from 'react';
import { copy } from '@/brand/copy';
import { Counter } from '@/components/ui/Counter';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { cityById, CITIES, type City } from '@/data/cities';
import { stateById, ZONE_NOTES, zoneLabel, type ZoneId } from '@/data/regions';
import { cn } from '@/lib/cn';
import { INDIA_VIEWBOX, projectIndia } from '@/lib/geo';
import './india-map.css';

type Tab = 'metro' | 'tier1' | 'tier2' | 'all';
type MapState = { id: string; name: string; d: string };
type Stat = { id: string; value: number; suffix?: string; label: string };

const ZONE_TINT: Record<ZoneId, string> = {
  north: 'var(--brand-100)',
  west: 'color-mix(in srgb, var(--brand-100) 70%, var(--cream))',
  south: 'color-mix(in srgb, var(--brand-100) 85%, var(--paper))',
  east: 'color-mix(in srgb, var(--brand-100) 55%, var(--cream))',
  central: 'color-mix(in srgb, var(--brand-100) 40%, var(--cream))',
  'north-east': 'color-mix(in srgb, var(--brand-100) 65%, var(--paper))',
};

function inTab(c: City, tab: Tab) {
  if (tab === 'all') return true;
  if (tab === 'tier2') return c.tier === 'tier2';
  return c.tier === tab;
}

/**
 * India reach map (BRIEF §5.1-G). City dots pulse in waves radiating from the
 * HQ city; tabs filter by tier; hovering a state shows that zone's strengths.
 */
export function IndiaMap({ states, hqCityId, stats, compact }: { states: MapState[]; hqCityId: string; stats: Stat[]; compact?: boolean }) {
  const [tab, setTab] = useState<Tab>('all');
  const [hover, setHover] = useState<{ id: string; x: number; y: number } | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const hq = cityById(hqCityId) ?? CITIES[0];
  const hqPt = projectIndia(hq.lat, hq.lng);

  const dots = useMemo(
    () =>
      CITIES.map((c) => {
        const p = projectIndia(c.lat, c.lng);
        const dist = Math.hypot(p.x - hqPt.x, p.y - hqPt.y);
        return { ...c, ...p, delay: (dist / 600) * 2.4 };
      }),
    [hqPt.x, hqPt.y],
  );

  const hoverState = hover ? stateById(hover.id) : undefined;
  const zone = hoverState?.zone;

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const id = (e.target as Element).getAttribute('data-state');
    if (!id || !wrap.current) return setHover(null);
    const r = wrap.current.getBoundingClientRect();
    setHover({ id, x: e.clientX - r.left, y: e.clientY - r.top });
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'metro', label: copy.map.tabs.metro },
    { id: 'tier1', label: copy.map.tabs.tier1 },
    { id: 'tier2', label: copy.map.tabs.tier2 },
    { id: 'all', label: copy.map.tabs.all },
  ];
  const count = dots.filter((d) => inTab(d, tab)).length;

  return (
    <div className={cn('grid items-center gap-10 lg:gap-16', compact ? 'lg:grid-cols-[1fr_0.8fr]' : 'lg:grid-cols-[1.1fr_0.9fr]')}>
      <div ref={wrap} className="relative mx-auto w-full max-w-[620px]" onPointerLeave={() => setHover(null)}>
        <svg viewBox={`0 0 ${INDIA_VIEWBOX.width} ${INDIA_VIEWBOX.height}`} className="india-map h-auto w-full" role="img" aria-label={`Map of India showing ${count} cities in the selected tier, with the HQ in ${hq.name}`} onPointerMove={onMove}>
          <g>
            {states.map((s) => {
              const info = stateById(s.id);
              const z = info?.zone;
              const lit = zone && z === zone;
              return (
                <path
                  key={s.id}
                  d={s.d}
                  data-state={s.id}
                  className="india-state"
                  style={{ fill: lit ? 'var(--brand)' : z ? ZONE_TINT[z] : 'var(--cream)', opacity: zone && !lit ? 0.75 : 1 }}
                />
              );
            })}
          </g>
          <g className="pointer-events-none">
            {dots.map((d) => {
              const on = inTab(d, tab);
              const isHq = d.id === hq.id;
              return (
                <g key={d.id} transform={`translate(${d.x} ${d.y})`} className={cn('india-dot', on ? 'is-on' : 'is-off')} style={{ ['--d' as string]: `${d.delay}s` }}>
                  {on ? <circle r="5" className="india-pulse" /> : null}
                  <circle r={isHq ? 7 : d.tier === 'metro' ? 5 : d.tier === 'tier1' ? 4 : 3} className={isHq ? 'india-hq' : 'india-core'} />
                  {isHq ? (
                    <g>
                      <circle r="13" className="india-hq-ring" />
                      <text x="12" y="-10" className="india-label">
                        {copy.map.hqLabel} · {d.name}
                      </text>
                    </g>
                  ) : null}
                </g>
              );
            })}
          </g>
        </svg>
        {hover && hoverState ? (
          <div
            className="pointer-events-none absolute z-10 w-[250px] rounded-[18px] bg-ink p-4 text-paper shadow-xl"
            style={{ left: Math.min(hover.x + 14, (wrap.current?.clientWidth ?? 600) - 260), top: Math.max(0, hover.y - 20) }}
            role="tooltip"
          >
            <p className="font-semibold">{hoverState.name}</p>
            <p className="mono mt-1 text-white/60">{zoneLabel(hoverState.zone)} zone</p>
            <ul className="mt-3 space-y-1 text-[13px]">
              {ZONE_NOTES[hoverState.zone].strengths.map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-brand" aria-hidden />
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[12px] leading-relaxed text-white/70">{ZONE_NOTES[hoverState.zone].note}</p>
          </div>
        ) : null}
      </div>

      <div>
        <div role="tablist" aria-label="Market tiers" className="inline-flex flex-wrap gap-1 rounded-full border border-line bg-paper p-1.5">
          {tabs.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={cn('rounded-full px-4 py-2 text-sm font-medium transition-colors', tab === t.id ? 'bg-brand text-on-brand' : 'hover:bg-cream')}>
              {t.label}
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm text-ink-60" aria-live="polite">
          {count} cities shown. Hover a state to see what works in its zone.
        </p>
        <dl className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {stats.map((s) => (
            <div key={s.id} className="flex items-baseline justify-between gap-6 border-b border-line pb-4">
              <dt className="text-[15px] text-ink-60">{s.label}</dt>
              <dd className="display text-[2.6rem] font-semibold leading-none">
                <Counter value={s.value} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
        <DemoBadge className="mt-6" />
      </div>
    </div>
  );
}
