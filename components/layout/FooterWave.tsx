'use client';
import { useRef } from 'react';
import { Glyph } from '@/components/glyphs/Glyph';
import { gsap, MotionPathPlugin, ScrollTrigger, useGSAP } from '@/lib/gsap';
import type { GlyphId } from '@/lib/types';

type WaveCard = { slug: string; shortName: string; glyph: GlyphId };

const PATH = 'M-80 190 C 120 60, 300 60, 480 170 S 820 300, 1010 170 S 1330 40, 1520 150';

/** Orange wave ribbon with channel cards riding along it (GSAP MotionPath). Speeds up with scroll velocity. */
export function FooterWave({ cards }: { cards: WaveCard[] }) {
  const root = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const p = path.current;
      if (!el || !p) return;
      const items = gsap.utils.toArray<HTMLElement>('[data-wave-card]', el);
      const raw = MotionPathPlugin.getRawPath(p);
      MotionPathPlugin.cacheRawPathMeasurements(raw);
      let w = el.clientWidth;
      let h = el.clientHeight;
      const place = (progress: number) => {
        items.forEach((item, i) => {
          const t = (((progress + i / items.length) % 1) + 1) % 1;
          const pt = MotionPathPlugin.getPositionOnPath(raw, t, true) as { x: number; y: number; angle: number };
          const x = ((pt.x + 80) / 1600) * w;
          const y = (pt.y / 340) * h;
          item.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -62%) rotate(${pt.angle * 0.55}deg)`;
        });
      };
      place(0);
      const onResize = () => {
        w = el.clientWidth;
        h = el.clientHeight;
        place(state.p);
      };
      window.addEventListener('resize', onResize);
      const state = { p: 0 };
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tween = gsap.to(state, { p: 1, duration: 46, ease: 'none', repeat: -1, onUpdate: () => place(state.p), paused: true });
        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => (self.isActive ? tween.play() : tween.pause()),
          onUpdate: (self) => {
            const boost = 1 + Math.min(6, Math.abs(self.getVelocity()) / 350);
            gsap.to(tween, { timeScale: boost, duration: 0.2, overwrite: true });
            gsap.to(tween, { timeScale: 1, duration: 1.2, delay: 0.2 });
          },
        });
        return () => {
          st.kill();
          tween.kill();
        };
      });
      return () => {
        window.removeEventListener('resize', onResize);
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative h-[220px] w-full overflow-hidden sm:h-[300px] lg:h-[340px]" aria-hidden>
      <svg viewBox="-80 0 1600 340" preserveAspectRatio="none" className="absolute inset-0 size-full">
        <path d={PATH} fill="none" stroke="var(--brand)" strokeWidth="64" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        <path ref={path} d={PATH} fill="none" stroke="color-mix(in srgb, var(--paper) 30%, transparent)" strokeWidth="1.5" strokeDasharray="2 10" vectorEffect="non-scaling-stroke" />
      </svg>
      {cards.map((c, i) => (
        <div
          key={c.slug}
          data-wave-card
          className={`absolute left-0 top-0 flex h-[92px] w-[72px] flex-col justify-between rounded-[14px] p-2 shadow-[0_14px_30px_-10px_rgba(0,0,0,0.6)] will-change-transform sm:h-[124px] sm:w-[96px] sm:rounded-[18px] sm:p-2.5 ${
            i % 3 === 0 ? 'bg-cream text-ink' : i % 3 === 1 ? 'bg-paper text-ink' : 'bg-[#232323] text-cream'
          }`}
        >
          <div className="aspect-square w-full">
            <Glyph id={c.glyph} tone={i % 3 === 2 ? 'ink' : 'light'} />
          </div>
          <span className="mono truncate !text-[8px] sm:!text-[9px]">{c.shortName}</span>
        </div>
      ))}
    </div>
  );
}
