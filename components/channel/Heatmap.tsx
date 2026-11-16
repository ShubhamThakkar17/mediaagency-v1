import { TLink } from '@/components/providers/Transition';
import { AUDIENCES } from '@/data/audiences';
import type { ChannelData } from '@/lib/types';

/** Channel × audience heatmap (1-5 planning assumptions). */
export function Heatmap({ channels }: { channels: ChannelData[] }) {
  const cell = (v: number) => `color-mix(in srgb, var(--brand) ${[0, 8, 22, 42, 68, 100][v]}%, var(--paper))`;
  return (
    <div className="overflow-x-auto rounded-[24px] border border-line bg-paper" tabIndex={0} role="region" aria-label="Channel by audience heatmap">
      <table className="w-full min-w-[860px] border-collapse text-[13px]">
        <caption className="sr-only">Audience affinity by channel, 1 (weak) to 5 (strong). Planning assumptions.</caption>
        <thead>
          <tr>
            <th scope="col" className="sticky left-0 z-10 bg-paper p-3 text-left font-medium">
              Channel
            </th>
            {AUDIENCES.map((a) => (
              <th key={a.id} scope="col" className="mono p-3 text-center !text-[10px] font-normal text-ink-60">
                {a.short}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {channels.map((c) => (
            <tr key={c.slug} className="border-t border-line">
              <th scope="row" className="sticky left-0 z-10 bg-paper p-3 text-left font-medium">
                <TLink href={`/channels/${c.slug}`} className="hover:text-brand-600">
                  {c.shortName}
                </TLink>
              </th>
              {AUDIENCES.map((a) => {
                const v = c.audienceAffinity[a.id];
                return (
                  <td key={a.id} className="p-1">
                    <span className="grid h-9 place-items-center rounded-lg font-medium tabular-nums" style={{ background: cell(v), color: v >= 4 ? 'var(--on-brand)' : 'var(--ink)' }}>
                      {v}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
