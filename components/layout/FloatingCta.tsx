'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { copy } from '@/brand/copy';
import { ArrowUpRight } from '@/components/ui/Icons';
import { cn } from '@/lib/cn';

export const OPEN_PLANNER_EVENT = 'planner:open';
export const openPlannerDrawer = () => window.dispatchEvent(new Event(OPEN_PLANNER_EVENT));

/** Fixed bottom-centre pill that opens the planner drawer (BRIEF §2). */
export function FloatingCta() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const nearEnd = y + window.innerHeight > document.documentElement.scrollHeight - 520;
      setShow(y > 500 && !nearEnd);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  if (pathname.startsWith('/planner') && pathname !== '/planner-methodology') return null;
  if (pathname.startsWith('/admin')) return null;

  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-x-0 bottom-5 z-[80] flex justify-center transition-[transform,opacity] duration-500 ease-[var(--ease-out-expo)]',
        show ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0',
      )}
    >
      <button
        type="button"
        onClick={openPlannerDrawer}
        tabIndex={show ? 0 : -1}
        className="pointer-events-auto flex h-14 items-center gap-3 rounded-full bg-ink pl-6 pr-2 text-[15px] font-medium text-paper shadow-[0_18px_40px_-12px_rgba(0,0,0,0.45)]"
      >
        {copy.floatingCta}
        <span className="grid size-10 place-items-center rounded-full bg-brand text-on-brand">
          <ArrowUpRight size={18} />
        </span>
      </button>
    </div>
  );
}
