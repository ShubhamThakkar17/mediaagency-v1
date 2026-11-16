'use client';
import { useState } from 'react';
import { SmartMedia } from '@/components/ui/SmartMedia';
import { cn } from '@/lib/cn';
import type { GlyphId, MediaRef } from '@/lib/types';

export type WorkItem = {
  id: string;
  year: number;
  title: string;
  client: string;
  industry: string;
  channels: { slug: string; name: string }[];
  markets: string;
  summary: string;
  result: string;
  media: MediaRef;
  glyph: GlyphId;
  shape: 'tall' | 'wide' | 'square';
};

/** Masonry of concept campaigns with a channel filter. Every card is tagged "Concept". */
export function WorkGrid({ items, filters }: { items: WorkItem[]; filters: { slug: string; name: string }[] }) {
  const [f, setF] = useState<string>('all');
  const shown = items.filter((it) => f === 'all' || it.channels.some((c) => c.slug === f));
  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by channel">
        <button type="button" className="chip" aria-pressed={f === 'all'} onClick={() => setF('all')}>
          All work
        </button>
        {filters.map((c) => (
          <button key={c.slug} type="button" className="chip" aria-pressed={f === c.slug} onClick={() => setF(c.slug)}>
            {c.name}
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm text-ink-60" aria-live="polite">
        {shown.length} {shown.length === 1 ? 'campaign' : 'campaigns'}
      </p>
      <ul className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>li]:mb-5">
        {shown.map((it) => (
          <li key={it.id} id={it.id} className="break-inside-avoid scroll-mt-28" data-reveal="fade">
            <article className="group overflow-hidden rounded-[26px] bg-cream">
              <div className="relative overflow-hidden">
                <SmartMedia media={it.media} glyph={it.glyph} className={cn('transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]', it.shape === 'tall' ? 'aspect-[4/5]' : it.shape === 'wide' ? 'aspect-[16/10]' : 'aspect-square')} sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 90vw" />
                <span className="mono absolute left-4 top-4 rounded-full bg-paper px-3 py-1.5 !text-[10px] text-ink">Concept</span>
              </div>
              <div className="p-6">
                <p className="mono text-ink-60">
                  {it.year} · {it.client} · {it.industry}
                </p>
                <h2 className="display mt-3 text-[1.7rem] font-semibold leading-tight">{it.title}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-60">{it.summary}</p>
                <p className="mt-4 text-[15px] font-semibold">{it.result}</p>
                <p className="mt-1 text-[13px] text-ink-60">{it.markets}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {it.channels.map((c) => (
                    <li key={c.slug} className="rounded-full bg-paper px-3 py-1 text-[12.5px] font-medium">
                      {c.name}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
