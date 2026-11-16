import { cn } from '@/lib/cn';

/** Horizontal 1-5 strength bars that grow in on reveal (CSS only). */
export function Bars({ rows, max = 5, tone = 'brand' }: { rows: { label: string; value: number; note?: string }[]; max?: number; tone?: 'brand' | 'ink' }) {
  return (
    <ul className="space-y-4">
      {rows.map((r, i) => (
        <li key={r.label}>
          <div className="mb-1.5 flex items-baseline justify-between gap-4 text-[14.5px]">
            <span className="font-medium">{r.label}</span>
            <span className="mono text-ink-60">
              {r.value}/{max}
              {r.note ? ` · ${r.note}` : ''}
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-mist">
            <div
              data-reveal="fade"
              className={cn('bar-grow h-full rounded-full', tone === 'brand' ? 'bg-brand' : 'bg-ink')}
              style={{ width: `${(r.value / max) * 100}%`, ['--reveal-delay' as string]: `${i * 0.08}s` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
