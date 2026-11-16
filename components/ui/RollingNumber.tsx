'use client';
import { useRef } from 'react';
import { useInView } from '@/lib/hooks';

/** Slot-machine digits: each digit is a column of 0-9 that rolls to its value. */
export function RollingNumber({ value, className, live }: { value: string | number; className?: string; /** Roll again whenever the value changes. */ live?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, '-10% 0px', true);
  const chars = String(value).split('');
  const active = inView || live;
  return (
    <span ref={ref} className={className} aria-label={String(value)} role="text" style={{ display: 'inline-flex', lineHeight: 1 }}>
      {chars.map((ch, i) =>
        /\d/.test(ch) ? (
          <span key={i} aria-hidden style={{ display: 'inline-block', height: '1em', overflow: 'hidden' }}>
            <span
              className="motion-reduce:!transition-none"
              style={{
                display: 'flex',
                flexDirection: 'column',
                transform: `translateY(${active ? -Number(ch) * 10 : 0}%)`,
                transition: `transform ${1.1 + i * 0.18}s cubic-bezier(0.16, 1, 0.3, 1)`,
              }}
            >
              {Array.from({ length: 10 }, (_, n) => (
                <span key={n} style={{ height: '1em', lineHeight: 1 }}>
                  {n}
                </span>
              ))}
            </span>
          </span>
        ) : (
          <span key={i} aria-hidden style={{ lineHeight: 1 }}>
            {ch}
          </span>
        ),
      )}
    </span>
  );
}
