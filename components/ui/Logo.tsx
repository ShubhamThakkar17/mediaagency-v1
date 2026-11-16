import { brand } from '@/brand/brand.config';
import { cn } from '@/lib/cn';

/** Typeset logo: base word in the current colour, accent in the brand colour. */
export function Logo({ className, accentClassName }: { className?: string; accentClassName?: string }) {
  return (
    <span className={cn('font-display text-[22px] font-semibold tracking-[-0.04em] leading-none', className)}>
      {brand.logo.base}
      <span className={cn('text-brand', accentClassName)}>{brand.logo.accent}</span>
    </span>
  );
}
