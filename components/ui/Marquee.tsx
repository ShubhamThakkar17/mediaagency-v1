import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** CSS-only infinite marquee. Pauses on hover; becomes a static row under reduced motion. */
export function Marquee({ children, reverse, duration = 40, gap = 16, className }: { children: ReactNode; reverse?: boolean; duration?: number; gap?: number; className?: string }) {
  const style = { ['--marquee-duration']: `${duration}s`, ['--marquee-gap']: `${gap}px` } as CSSProperties;
  return (
    <div className={cn('marquee', className)} data-reverse={reverse ? 'true' : 'false'} style={style}>
      <div className="marquee-track">{children}</div>
      <div className="marquee-track" aria-hidden="true">
        {children}
      </div>
    </div>
  );
}
