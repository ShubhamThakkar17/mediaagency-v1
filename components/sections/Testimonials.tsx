'use client';
import { motion, AnimatePresence, type PanInfo } from 'motion/react';
import { useState } from 'react';
import { copy } from '@/brand/copy';
import type { DemoTestimonial } from '@/content/demo';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { Emph } from '@/components/ui/Emph';
import { ArrowLeft, ArrowRight } from '@/components/ui/Icons';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useReducedMotion } from '@/lib/hooks';

/** Orange quote card on top of a deck. Fans on hover, drag or buttons to swipe (BRIEF §2 row 12). */
export function Testimonials({ items, rating }: { items: DemoTestimonial[]; rating: { value: number; count: number; label: string } }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [fan, setFan] = useState(false);
  const reduced = useReducedMotion();
  const n = items.length;
  const go = (d: number) => {
    setDir(d);
    setIndex((i) => (i + d + n) % n);
  };
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 500) go(info.offset.x < 0 ? 1 : -1);
  };
  const t = items[index];
  const pad = (v: number) => String(v).padStart(2, '0');

  return (
    <section className="section overflow-hidden bg-cream" aria-labelledby="testimonials-title" aria-roledescription="carousel">
      <div className="wrap grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col gap-8">
          <SectionHeading label={copy.testimonials.label} id="testimonials-title" title={<Emph text={copy.testimonials.title} />} />
          <div className="flex items-center gap-4" data-reveal="fade">
            <span className="display text-[3.5rem] font-semibold leading-none">{rating.value}</span>
            <div>
              <span className="block text-lg tracking-[0.2em] text-brand" aria-hidden>
                ★★★★★
              </span>
              <span className="text-sm text-ink-60">
                {rating.label} ({rating.count}+)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => go(-1)} className="grid size-14 place-items-center rounded-full border border-ink/20 bg-paper transition-colors hover:bg-ink hover:text-paper" aria-label="Previous testimonial">
              <ArrowLeft />
            </button>
            <button type="button" onClick={() => go(1)} className="grid size-14 place-items-center rounded-full bg-brand text-on-brand transition-colors hover:bg-brand-600" aria-label="Next testimonial">
              <ArrowRight />
            </button>
            <span className="mono ml-2 !text-[13px]" aria-live="polite">
              {pad(index + 1)} / {pad(n)}
            </span>
          </div>
          <DemoBadge className="self-start" />
        </div>

        <div className="relative mx-auto h-[420px] w-full max-w-[540px] sm:h-[400px]" onPointerEnter={() => setFan(true)} onPointerLeave={() => setFan(false)}>
          {[3, 2, 1].map((depth) => (
            <div
              key={depth}
              aria-hidden
              className="absolute inset-0 rounded-[28px] border border-line bg-paper shadow-sm transition-transform duration-500 ease-[var(--ease-out-expo)]"
              style={{ transform: `translate(${depth * (fan ? 20 : 12)}px, ${depth * (fan ? 14 : 10)}px) rotate(${depth * (fan ? 4 : 2)}deg)`, opacity: 1 - depth * 0.15 }}
            />
          ))}
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.figure
              key={t.id}
              custom={dir}
              drag={reduced ? false : 'x'}
              dragSnapToOrigin
              dragElastic={0.6}
              onDragEnd={onDragEnd}
              whileDrag={{ rotate: 0, cursor: 'grabbing' }}
              initial={reduced ? { opacity: 0 } : { x: dir * 120, opacity: 0, rotate: dir * 6 }}
              animate={{ x: 0, opacity: 1, rotate: 0 }}
              exit={reduced ? { opacity: 0 } : { x: dir * -260, opacity: 0, rotate: dir * -10 }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className="absolute inset-0 flex cursor-grab touch-pan-y flex-col justify-between rounded-[28px] bg-brand p-8 text-on-brand shadow-[0_30px_60px_-20px_color-mix(in_srgb,var(--brand)_70%,transparent)] sm:p-10"
              data-cursor="Drag"
            >
              <span className="display text-[5rem] leading-[0.6]" aria-hidden>
                “
              </span>
              <blockquote className="display text-[clamp(1.4rem,2.4vw,1.95rem)] font-medium leading-[1.2] tracking-[-0.02em]">{t.quote}</blockquote>
              <figcaption className="flex items-center gap-4">
                <span className="grid size-14 place-items-center rounded-full bg-ink font-display text-lg font-semibold text-paper" aria-hidden>
                  {t.initials}
                </span>
                <span>
                  <span className="block font-semibold">{t.name}</span>
                  <span className="block text-sm opacity-80">
                    {t.role}, {t.company}
                  </span>
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
