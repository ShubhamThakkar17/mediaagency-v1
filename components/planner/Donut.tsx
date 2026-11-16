'use client';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatINRCompact } from '@/lib/format-inr';
import { useReducedMotion } from '@/lib/hooks';

import { MIX_COLORS } from './mix-colors';
export { MIX_COLORS };

export function Donut({ data, centreLabel, centreValue, size = 240 }: { data: { name: string; value: number }[]; centreLabel: string; centreValue: string; size?: number }) {
  const reduced = useReducedMotion();
  const empty = data.length === 0;
  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={empty ? [{ name: 'empty', value: 1 }] : data}
            dataKey="value"
            nameKey="name"
            innerRadius="66%"
            outerRadius="100%"
            paddingAngle={empty ? 0 : 2}
            cornerRadius={6}
            stroke="none"
            startAngle={90}
            endAngle={-270}
            isAnimationActive={!reduced}
            animationDuration={700}
            animationEasing="ease-out"
          >
            {(empty ? [0] : data).map((_, i) => (
              <Cell key={i} fill={empty ? 'var(--line)' : MIX_COLORS[i % MIX_COLORS.length]} />
            ))}
          </Pie>
          {!empty ? (
            <Tooltip
              formatter={(v) => formatINRCompact(Number(v))}
              contentStyle={{ borderRadius: 14, border: '1px solid var(--line)', background: 'var(--paper)', fontSize: 13 }}
            />
          ) : null}
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="mono text-ink-60">{centreLabel}</p>
          <p className="display mt-1 text-[1.9rem] font-semibold leading-none">{centreValue}</p>
        </div>
      </div>
    </div>
  );
}
