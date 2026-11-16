'use client';
import { animate, useMotionValue, useTransform, motion } from 'motion/react';
import { useEffect } from 'react';
import { useReducedMotion } from '@/lib/hooks';

/** A number that tweens to its new value whenever it changes. */
export function Tween({ value, format }: { value: number; format: (n: number) => string }) {
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) => format(v));
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) {
      mv.set(value);
      return;
    }
    const c = animate(mv, value, { duration: 0.6, ease: [0.16, 1, 0.3, 1] });
    return () => c.stop();
  }, [value, mv, reduced]);
  return <motion.span style={{ fontVariantNumeric: 'tabular-nums' }}>{text}</motion.span>;
}
