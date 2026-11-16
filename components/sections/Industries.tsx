'use client';
import { useRef, useState } from 'react';
import { copy } from '@/brand/copy';
import { TLink } from '@/components/providers/Transition';
import { Emph } from '@/components/ui/Emph';
import { SmartMedia } from '@/components/ui/SmartMedia';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { cn } from '@/lib/cn';
import type { GlyphId, MediaRef } from '@/lib/types';

export type IndustryView = {
  id: string;
  label: string;
  description: string;
  channels: { slug: string; shortName: string }[];
  metrics: { value: string; label: string }[];
  media: MediaRef;
  glyph: GlyphId;
};

/** Full-orange section. On desktop it pins and the active industry follows scroll; the card image cross-fades with a 3D tilt (BRIEF §2 row 6). */
export function Industries({ items }: { items: IndustryView[] }) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference) and (min-width: 1024px)', () => {
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: 'top top',
          end: () => `+=${items.length * 320}`,
          pin: true,
          scrub: true,
          onUpdate: (self) => setActive(Math.min(items.length - 1, Math.floor(self.progress * items.length * 0.999))),
        });
        return () => st.kill();
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [items.length] },
  );

  const cur = items[active];
  return (
    <section ref={root} className="on-brand relative overflow-hidden bg-brand text-on-brand lg:h-screen" aria-labelledby="industries-title">
      <div className="bg-dots-light absolute inset-0" aria-hidden />
      <div className="wrap relative grid h-full items-center gap-10 py-[clamp(72px,9vw,120px)] lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:py-0">
        <div className="order-2 lg:order-1" style={{ perspective: 1200 }}>
          <div className="relative overflow-hidden rounded-[30px] bg-ink p-4 text-paper shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[22px]">
              {items.map((it, i) => (
                <div
                  key={it.id}
                  className="absolute inset-0 transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)]"
                  style={{ opacity: i === active ? 1 : 0, transform: i === active ? 'rotateY(0deg) scale(1)' : `rotateY(${i < active ? -12 : 12}deg) scale(1.06)` }}
                  aria-hidden={i !== active}
                >
                  <SmartMedia media={it.media} glyph={it.glyph} className="size-full" sizes="(min-width:1024px) 40vw, 90vw" />
                </div>
              ))}
            </div>
            <div className="p-3 pt-5">
              <p className="text-[15px] leading-relaxed text-white/80">{cur.description}</p>
              <p className="mono mt-5 text-white/60">{copy.industries.channelsLabel}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {cur.channels.map((c) => (
                  <li key={c.slug}>
                    <TLink href={`/channels/${c.slug}`} className="chip !border-white/15 !bg-white/10 !text-paper hover:!bg-white/20">
                      {c.shortName}
                    </TLink>
                  </li>
                ))}
              </ul>
              <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/15 pt-5">
                {cur.metrics.map((m) => (
                  <div key={m.label}>
                    <dt className="sr-only">{m.label}</dt>
                    <dd className="display text-[2.4rem] font-semibold leading-none text-brand">{m.value}</dd>
                    <dd className="mt-1.5 text-[13px] text-white/70">{m.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <span className="pill-label">{copy.industries.label}</span>
          <h2 id="industries-title" className="display t-2 mt-6 max-w-[14ch]">
            <Emph text={copy.industries.title} />
          </h2>
          <div className="mt-8 flex flex-col" role="tablist" aria-label="Industries">
            {items.map((it, i) => (
                <button
                  key={it.id}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  onClick={() => setActive(i)}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && window.innerWidth < 1024 && setActive(i)}
                  className={cn(
                    'display flex w-full items-center gap-4 py-1 text-left text-[clamp(1.6rem,3.1vw,2.8rem)] font-semibold leading-[1.15] transition-[color,transform] duration-500 ease-[var(--ease-out-expo)]',
                    i === active ? 'translate-x-3 text-paper' : 'text-ink/60 hover:text-ink/80',
                  )}
                >
                  <span className={cn('size-3 shrink-0 rounded-full bg-paper transition-transform duration-500', i === active ? 'scale-100' : 'scale-0')} aria-hidden />
                  {it.label}
                </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
