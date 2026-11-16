import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { SplitHeading } from './SplitHeading';

type Props = {
  label: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2';
  size?: 't-1' | 't-2';
  className?: string;
  children?: ReactNode;
  id?: string;
};

/** Orange pill label + big tight headline + optional lede. Used above every section. */
export function SectionHeading({ label, title, lede, align = 'left', as = 'h2', size = 't-2', className, children, id }: Props) {
  return (
    <div className={cn('flex flex-col gap-6', align === 'center' && 'items-center text-center', className)}>
      <span className="pill-label" data-reveal="fade">
        {label}
      </span>
      <SplitHeading as={as} id={id} className={cn(size, align === 'center' ? 'max-w-[18ch]' : 'max-w-[16ch]')}>
        {title}
      </SplitHeading>
      {lede ? (
        <p className={cn('lede max-w-[56ch]', align === 'center' && 'mx-auto')} data-reveal="fade" style={{ ['--reveal-delay' as string]: '0.15s' }}>
          {lede}
        </p>
      ) : null}
      {children}
    </div>
  );
}
