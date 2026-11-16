'use client';
import { Glyph } from '@/components/glyphs/Glyph';
import { cn } from '@/lib/cn';
import type { ChannelLite } from '@/lib/types';

/** Mode B: pick channels from 18 cards, each showing its glyph. */
export function ChannelPicker({ channels, selected, onToggle, compact }: { channels: ChannelLite[]; selected: string[]; onToggle: (slug: string) => void; compact?: boolean }) {
  return (
    <div className={cn('grid gap-2', compact ? 'grid-cols-3 sm:grid-cols-6' : 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4')} role="group" aria-label="Channels">
      {channels.map((c) => {
        const on = selected.includes(c.slug);
        return (
          <button
            key={c.slug}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(c.slug)}
            title={c.name}
            className={cn(
              'group relative flex items-center gap-2 rounded-2xl border p-2 text-left transition-all duration-300',
              compact ? 'flex-col justify-center gap-1 p-2' : 'p-2.5',
              on ? 'border-ink bg-ink text-paper' : 'border-line bg-paper hover:border-ink',
            )}
          >
            <span className={cn('shrink-0', compact ? 'size-10' : 'size-11')}>
              <Glyph id={c.glyph} tone={on ? 'ink' : 'light'} />
            </span>
            <span className={cn('font-medium leading-tight', compact ? 'text-center text-[11px]' : 'text-[13px]')}>{c.shortName}</span>
            <span className={cn('absolute right-2 top-2 grid size-4 place-items-center rounded-full text-[10px] transition-opacity', on ? 'bg-brand text-on-brand opacity-100' : 'opacity-0')} aria-hidden>
              ✓
            </span>
          </button>
        );
      })}
    </div>
  );
}
