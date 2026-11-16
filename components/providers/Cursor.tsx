'use client';
import { useEffect, useRef } from 'react';

/**
 * Custom cursor (desktop, fine pointers only). A small brand dot that grows
 * into a labelled ring over elements carrying data-cursor="Drag" / "View".
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = dot.current;
    if (!el) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let x = 0,
      y = 0,
      tx = 0,
      ty = 0,
      raf = 0,
      shown = false;
    const loop = () => {
      x += (tx - x) * 0.28;
      y += (ty - y) * 0.28;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.1 ? requestAnimationFrame(loop) : 0;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        shown = true;
        x = tx;
        y = ty;
        el.style.opacity = '1';
      }
      const target = (e.target as Element | null)?.closest?.('[data-cursor]');
      const text = target?.getAttribute('data-cursor') ?? '';
      el.dataset.mode = text ? 'label' : 'dot';
      if (label.current && text) label.current.textContent = text;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onLeave = () => {
      shown = false;
      el.style.opacity = '0';
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={dot} className="cursor-dot" data-mode="dot" aria-hidden>
      <span ref={label} />
    </div>
  );
}
