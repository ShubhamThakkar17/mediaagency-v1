'use client';
import { useRef, useState } from 'react';
import { TLink } from '@/components/providers/Transition';
import { PosterCard } from '@/components/ui/PosterCard';
import { CATEGORIES, type CategoryId } from '@/data/categories';
import { Flip, gsap, useGSAP } from '@/lib/gsap';
import { cn } from '@/lib/cn';
import type { ChannelLite } from '@/lib/types';

/** Filterable grid of the 18 posters. Category tabs re-flow the grid with GSAP Flip. */
export function ChannelGrid({ channels }: { channels: ChannelLite[] }) {
  const [cat, setCat] = useState<CategoryId | 'all'>('all');
  const grid = useRef<HTMLUListElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const choose = (c: CategoryId | 'all') => {
    if (grid.current) flipState.current = Flip.getState(grid.current.querySelectorAll('[data-flip]'));
    setCat(c);
  };

  useGSAP(
    () => {
      if (!flipState.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      Flip.from(flipState.current, {
        duration: 0.7,
        ease: 'expo.out',
        stagger: 0.02,
        absolute: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.6 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.85, duration: 0.3 }),
      });
      flipState.current = null;
    },
    { dependencies: [cat], scope: grid },
  );

  const tabs: { id: CategoryId | 'all'; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: channels.length },
    ...CATEGORIES.map((c) => ({ id: c.id, label: c.title, count: channels.filter((ch) => ch.category === c.id).length })),
  ];

  return (
    <div>
      <div role="tablist" aria-label="Channel categories" className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={cat === t.id}
            onClick={() => choose(t.id)}
            className={cn('chip !h-11 !px-5 !text-[14px]', cat === t.id && '!border-brand !bg-brand !text-on-brand')}
          >
            {t.label}
            <span className="mono !text-[10px] opacity-70">{t.count}</span>
          </button>
        ))}
      </div>
      <ul ref={grid} className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {channels.map((c) => (
          <li key={c.slug} data-flip data-flip-id={c.slug} hidden={cat !== 'all' && c.category !== cat}>
            <TLink href={`/channels/${c.slug}`} expand className="group block" data-cursor="View">
              <div className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-1.5 group-hover:rotate-[-1deg]">
                <PosterCard channel={c} sizes="(min-width:1280px) 16vw, (min-width:640px) 30vw, 45vw" />
              </div>
              <p className="mt-3 text-[14px] font-medium">{c.name}</p>
              <p className="text-[13px] text-ink-60">{c.roleKpi}</p>
            </TLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
