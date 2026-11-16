'use client';
import { useRef } from 'react';
import { copy } from '@/brand/copy';
import { Glyph, type AnyGlyphId } from '@/components/glyphs/Glyph';
import { TLink } from '@/components/providers/Transition';
import { Emph } from '@/components/ui/Emph';
import { ArrowUpRight } from '@/components/ui/Icons';
import { SmartMedia } from '@/components/ui/SmartMedia';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import type { MediaRef } from '@/lib/types';

/** Three rows that stack while sticky: each pins and the next slides over it, scaling the previous to 0.92 (BRIEF §2 row 9). */
export function FeatureStack({ media }: { media: MediaRef[] }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference) and (min-width: 768px)', () => {
        const cards = gsap.utils.toArray<HTMLElement>('[data-stack-card]');
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          gsap.to(card.firstElementChild, {
            scale: 0.92,
            filter: 'brightness(0.94)',
            ease: 'none',
            scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top+=110', scrub: true },
          });
        });
        ScrollTrigger.refresh();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section className="relative bg-paper pb-[clamp(72px,9vw,140px)]" aria-label={copy.features.label}>
      <div ref={root} className="wrap flex flex-col gap-6 md:gap-0">
        {copy.features.rows.map((row, i) => (
          <div key={row.index} data-stack-card className="md:sticky md:top-[96px] md:h-[calc(100vh-120px)] md:max-h-[680px] md:pb-8">
            <article className="relative grid h-full origin-top items-center gap-8 overflow-hidden rounded-[32px] bg-cream p-6 sm:p-10 md:grid-cols-2 md:gap-12 lg:p-14">
              <div className="glow -left-[10%] -top-[20%] h-[70%] w-[60%] !opacity-25" aria-hidden />
              <div className="relative flex flex-col items-start gap-6">
                <span className="grid size-14 place-items-center rounded-full border border-ink/15 bg-paper font-display text-lg font-semibold">{row.index}</span>
                <h2 className="display t-2 max-w-[13ch]">
                  <Emph text={row.title} />
                </h2>
                <p className="lede max-w-[44ch]">{row.body}</p>
                <TLink href="/services" className="btn btn-ink">
                  {copy.features.cta} <ArrowUpRight size={18} />
                </TLink>
              </div>
              <div className="relative">
                <SmartMedia media={media[i]} glyph={row.glyph as AnyGlyphId} className="aspect-[4/3] rounded-[24px] md:aspect-[5/4]" sizes="(min-width:768px) 45vw, 90vw" />
                <div className="absolute -bottom-5 -left-3 grid size-[104px] place-items-center rounded-[24px] bg-brand p-3 shadow-[0_20px_40px_-12px_color-mix(in_srgb,var(--brand)_70%,transparent)] sm:-left-6 sm:size-[128px]">
                  <Glyph id={row.glyph as AnyGlyphId} tone="brand" />
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
