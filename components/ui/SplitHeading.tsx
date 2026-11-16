'use client';
import { createElement, useRef, type ReactNode } from 'react';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';
import { cn } from '@/lib/cn';

type Props = {
  as?: 'h1' | 'h2' | 'h3' | 'p';
  children: ReactNode;
  className?: string;
  /** Animate immediately instead of on scroll. */
  immediate?: boolean;
  delay?: number;
  by?: 'lines' | 'words';
  id?: string;
};

/** Headline reveal: lines mask up with a 0.06 s stagger (BRIEF §7.1). */
export function SplitHeading({ as = 'h2', children, className, immediate, delay = 0, by = 'lines', id }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = SplitText.create(el, {
          type: by === 'words' ? 'lines,words' : 'lines',
          mask: 'lines',
          linesClass: 'split-line',
          autoSplit: true,
          onSplit(self) {
            const targets = by === 'words' ? self.words : self.lines;
            return gsap.from(targets, {
              yPercent: 110,
              duration: 1,
              ease: 'expo.out',
              stagger: by === 'words' ? 0.04 : 0.06,
              delay,
              scrollTrigger: immediate ? undefined : { trigger: el, start: 'top 90%', once: true },
            });
          },
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return createElement(as, { ref, id, className: cn('display', className) }, children);
}
