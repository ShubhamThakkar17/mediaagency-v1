'use client';
import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

/** The headline block drifts up faster than the page as the hero scrolls out. */
export function HeroParallax({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference) and (min-width: 768px)', () => {
        gsap.to(ref.current, { y: -90, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top 60%', end: 'bottom top', scrub: true } });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
