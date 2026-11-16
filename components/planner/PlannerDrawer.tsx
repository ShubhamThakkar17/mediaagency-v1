'use client';
import { AnimatePresence, motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { OPEN_PLANNER_EVENT } from '@/components/layout/FloatingCta';
import { getLenis } from '@/components/providers/SmoothScroll';
import type { ChannelLite } from '@/lib/types';
import { Planner } from './Planner';

/** Slide-over planner opened by the floating "Plan my media" pill. */
export function PlannerDrawer({ channels }: { channels: ChannelLite[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_PLANNER_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_PLANNER_EVENT, onOpen);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const lenis = getLenis();
    if (open) {
      lenis?.stop();
      document.documentElement.style.overflow = 'hidden';
      const prev = document.activeElement as HTMLElement | null;
      setTimeout(() => panel.current?.querySelector<HTMLElement>('button')?.focus(), 50);
      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
      window.addEventListener('keydown', onKey);
      return () => {
        window.removeEventListener('keydown', onKey);
        lenis?.start();
        document.documentElement.style.overflow = '';
        prev?.focus();
      };
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-[125] bg-ink/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Media planner"
            data-lenis-prevent
            className="absolute inset-x-0 bottom-0 max-h-[92vh] overflow-y-auto rounded-t-[32px] bg-paper p-5 sm:p-8 lg:inset-y-3 lg:left-auto lg:right-3 lg:max-h-none lg:w-[min(1080px,calc(100vw-24px))] lg:rounded-[32px]"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="pill-label">Media planner</span>
              <button type="button" onClick={() => setOpen(false)} className="grid size-11 place-items-center rounded-full border border-line" aria-label="Close planner">
                ✕
              </button>
            </div>
            <Planner channels={channels} variant="compact" />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
