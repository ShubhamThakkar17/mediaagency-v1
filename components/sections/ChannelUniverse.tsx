'use client';
import { useRef } from 'react';
import { copy } from '@/brand/copy';
import { Glyph } from '@/components/glyphs/Glyph';
import { TLink } from '@/components/providers/Transition';
import { Emph } from '@/components/ui/Emph';
import { ArrowUpRight } from '@/components/ui/Icons';
import { SmartMedia } from '@/components/ui/SmartMedia';
import { gsap, useGSAP } from '@/lib/gsap';
import type { GlyphId, MediaRef } from '@/lib/types';

export type UniversePanel = {
  id: string;
  label: string;
  title: string;
  bestFor: string;
  media: MediaRef;
  video?: MediaRef;
  channels: { slug: string; name: string; glyph: GlyphId }[];
};

/** Pinned horizontal scroll through six category panels, with a progress bar (BRIEF §5.1-F). Mobile: vertical stack with snap. */
export function ChannelUniverse({ panels }: { panels: UniversePanel[] }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference) and (min-width: 1024px)', () => {
        const t = track.current!;
        const distance = () => t.scrollWidth - window.innerWidth;
        gsap.to(t, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => bar.current && (bar.current.style.transform = `scaleX(${self.progress})`),
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="on-dark relative overflow-hidden bg-ink text-paper lg:h-screen" aria-labelledby="universe-title">
      <div className="flex h-full flex-col">
        <div className="wrap flex shrink-0 flex-col gap-4 pb-8 pt-[clamp(72px,8vw,110px)] lg:flex-row lg:items-end lg:justify-between lg:pt-[calc(var(--nav-h)+28px)]">
          <div>
            <span className="pill-label">{copy.universe.label}</span>
            <h2 id="universe-title" className="display t-2 mt-5 max-w-[14ch]">
              <Emph text={copy.universe.title} />
            </h2>
          </div>
          <p className="max-w-[44ch] text-[15px] leading-relaxed text-white/70">{copy.universe.lede}</p>
        </div>

        <div className="relative min-h-0 flex-1">
          <div ref={track} className="flex h-full flex-col gap-5 px-4 pb-10 will-change-transform lg:flex-row lg:gap-6 lg:px-[clamp(16px,4vw,48px)] lg:pb-14">
            {panels.map((p, i) => (
              <article key={p.id} className="relative flex min-h-[78vh] w-full shrink-0 snap-start flex-col justify-between overflow-hidden rounded-[30px] p-6 sm:p-9 lg:min-h-0 lg:w-[min(78vw,1080px)]">
                <SmartMedia media={p.media} video={p.video} glyph={p.channels[0]?.glyph} kenBurns className="!absolute inset-0" sizes="(min-width:1024px) 78vw, 100vw" />
                <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(15,15,15,0.92)_15%,rgba(15,15,15,0.55)_55%,rgba(15,15,15,0.25)_100%)]" aria-hidden />
                <div className="relative flex items-start justify-between gap-6">
                  <div>
                    <p className="mono text-white/70">
                      ({String(i + 1).padStart(2, '0')}) {p.label}
                    </p>
                    <h3 className="display mt-3 text-[clamp(2rem,4vw,3.6rem)] font-semibold">{p.title}</h3>
                  </div>
                  <div className="hidden gap-2 sm:flex">
                    {p.channels.map((c) => (
                      <span key={c.slug} className="grid size-[68px] place-items-center rounded-[18px] bg-white/10 p-2 backdrop-blur-md lg:size-[84px]">
                        <Glyph id={c.glyph} tone="ink" />
                      </span>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <ul className="flex flex-col">
                    {p.channels.map((c) => (
                      <li key={c.slug}>
                        <TLink href={`/channels/${c.slug}`} className="group flex items-center gap-4 border-t border-white/15 py-2.5 lg:py-3" data-cursor="View">
                          <span className="display text-[clamp(1.4rem,2.6vw,2.5rem)] font-medium transition-[color,transform] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2 group-hover:text-brand">{c.name}</span>
                          <ArrowUpRight size={24} className="ml-auto shrink-0 transition-transform duration-500 group-hover:rotate-45" />
                        </TLink>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 max-w-[60ch] text-[15px] leading-relaxed text-white/80">{p.bestFor}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="absolute inset-x-[clamp(16px,4vw,48px)] bottom-5 hidden h-[3px] overflow-hidden rounded-full bg-white/15 lg:block" aria-hidden>
            <div ref={bar} className="h-full origin-left scale-x-0 bg-brand" />
          </div>
        </div>
      </div>
    </section>
  );
}
