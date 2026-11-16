import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { SplitHeading } from './SplitHeading';

/** Inner-page header: dotted grid, glow, pill label, giant split headline. */
export function PageHero({ label, title, lede, children, className, aside }: { label: string; title: ReactNode; lede?: ReactNode; children?: ReactNode; className?: string; aside?: ReactNode }) {
  return (
    <section className={cn('bg-dots grain relative overflow-hidden bg-paper pb-[clamp(56px,7vw,100px)] pt-[calc(var(--nav-h)+clamp(48px,7vw,110px))]', className)}>
      <div className="glow -right-[12%] -top-[30%] h-[80%] w-[50%] !opacity-25" aria-hidden />
      <div className="wrap relative grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col items-start gap-6">
          <span className="pill-label">{label}</span>
          <SplitHeading as="h1" immediate className="t-1 max-w-[16ch]">
            {title}
          </SplitHeading>
          {lede ? <p className="lede max-w-[56ch]">{lede}</p> : null}
          {children}
        </div>
        {aside ? <div className="relative">{aside}</div> : null}
      </div>
    </section>
  );
}
