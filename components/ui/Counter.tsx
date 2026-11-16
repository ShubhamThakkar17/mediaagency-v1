'use client';
import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

type Props = { value: number; prefix?: string; suffix?: string; duration?: number; className?: string; decimals?: number };

/** Counts up the first time it enters the viewport. Renders the final value on the server. */
export function Counter({ value, prefix = '', suffix = '', duration = 1.6, className, decimals }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const d = decimals ?? (Number.isInteger(value) ? 0 : 1);
  const [text, setText] = useState(value.toFixed(d));

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / (duration * 1000));
          const eased = 1 - Math.pow(2, -10 * t);
          setText((value * (t === 1 ? 1 : eased)).toFixed(d));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        setText((0).toFixed(d));
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration, d]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}
      {text}
      {suffix}
    </span>
  );
}
