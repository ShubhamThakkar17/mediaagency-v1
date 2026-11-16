'use client';
import { useRef, type ReactNode } from 'react';
import { gsap } from '@/lib/gsap';

/** Primary buttons drift up to `strength` px toward the cursor (BRIEF §7.5). */
export function Magnetic({ children, strength = 6, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    gsap.to(el, { x: dx * strength, y: dy * strength, duration: 0.4, ease: 'power3.out', overwrite: true });
  };
  const leave = () => ref.current && gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)', overwrite: true });
  return (
    <span ref={ref} className={className ?? 'inline-block'} onPointerMove={move} onPointerLeave={leave}>
      {children}
    </span>
  );
}
