'use client';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useReducedMotion } from '@/lib/hooks';

/** Audience affinity bar chart (Recharts, styled with brand tokens). */
export default function AudienceChart({ data }: { data: { name: string; value: number }[] }) {
  const reduced = useReducedMotion();
  return (
    <div className="h-[340px] w-full" role="img" aria-label={`Audience affinity: ${data.map((d) => `${d.name} ${d.value} of 5`).join(', ')}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
          <XAxis type="number" domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11, fill: 'var(--ink-60)' }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" width={118} tick={{ fontSize: 12.5, fill: 'var(--ink)' }} axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: 'var(--mist)' }} formatter={(v) => [`${v} of 5`, 'Affinity']} contentStyle={{ borderRadius: 12, border: '1px solid var(--line)', fontSize: 13 }} />
          <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={18} isAnimationActive={!reduced} animationDuration={900}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.value >= 4 ? 'var(--brand)' : d.value === 3 ? 'color-mix(in srgb, var(--brand) 55%, var(--paper))' : 'var(--line)'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
