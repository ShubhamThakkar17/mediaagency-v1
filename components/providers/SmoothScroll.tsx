'use client';
import Lenis from 'lenis';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/motion';

let lenis: Lenis | null = null;
export const getLenis = () => lenis;

/** Scroll helper that works with or without Lenis. */
export function scrollToTarget(target: string | number | HTMLElement, immediate = false) {
  if (lenis) lenis.scrollTo(target, { immediate, offset: typeof target === 'number' ? 0 : -90 });
  else if (typeof target === 'number') window.scrollTo({ top: target, behavior: immediate ? 'auto' : 'smooth' });
  else (typeof target === 'string' ? document.querySelector(target) : target)?.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' });
}

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return; // Lenis is disabled under reduced motion (BRIEF §7.6)
    const instance = new Lenis({ lerp: 0.11, wheelMultiplier: 1, smoothWheel: true, syncTouch: false });
    lenis = instance;
    instance.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      instance.destroy();
      lenis = null;
    };
  }, []);

  // New route: jump to top and let ScrollTrigger re-measure the new page.
  // Skipped on first mount so a reload keeps the browser's restored scroll position.
  const firstRoute = useRef(true);
  useEffect(() => {
    if (firstRoute.current) {
      firstRoute.current = false;
      return;
    }
    if (window.location.hash) return;
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
    const t = setTimeout(() => ScrollTrigger.refresh(), 350);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
