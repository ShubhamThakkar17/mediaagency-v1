'use client';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { REDUCED_MOTION_QUERY } from './motion';

function subscribeMQ(query: string) {
  return (cb: () => void) => {
    const mq = window.matchMedia(query);
    mq.addEventListener('change', cb);
    return () => mq.removeEventListener('change', cb);
  };
}

export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    subscribeMQ(query),
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export const useReducedMotion = () => useMediaQuery(REDUCED_MOTION_QUERY);
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)', true);
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)');

export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

/** True while the element is near the viewport. */
export function useInView<T extends Element>(ref: React.RefObject<T | null>, rootMargin = '200px', once = false) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (e.isIntersecting && once) io.disconnect();
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, once]);
  return inView;
}
