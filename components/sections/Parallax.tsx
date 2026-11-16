'use client';
import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

/** Scroll-linked vertical drift. Negative speed moves up faster than the page. */
export function Parallax({ children, speed = 40, className }: { children: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference) and (min-width: 768px)', () => {
        gsap.fromTo(ref.current, { y: -speed / 2 }, { y: speed / 2, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } });
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
