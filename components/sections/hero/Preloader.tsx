'use client';
import { useEffect, useRef } from 'react';
import { Logo } from '@/components/ui/Logo';
import { gsap } from '@/lib/gsap';

const COUNT = 18;

/**
 * First-visit preloader (BRIEF §2 row 0): 18 cards fly in and assemble into a
 * ring while a counter runs 00 to 100%. ≤ 1.6 s, skippable, once per session.
 * Visibility is decided before paint by the boot script in app/layout.tsx.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const html = document.documentElement;
    const finish = () => {
      html.classList.add('preload-done');
      try {
        sessionStorage.setItem('preloaded', '1');
      } catch {}
    };
    if (html.classList.contains('no-preload')) {
      finish();
      return;
    }
    const cards = el.querySelectorAll<HTMLElement>('.pre-card');
    const num = { v: 0 };
    const tl = gsap.timeline({
      defaults: { ease: 'expo.out' },
      onComplete: () => {
        el.style.display = 'none';
      },
    });
    tl.fromTo(
      cards,
      { x: () => gsap.utils.random(-520, 520), y: () => gsap.utils.random(-360, 360), z: -400, rotateZ: () => gsap.utils.random(-50, 50), opacity: 0 },
      { x: 0, y: 0, z: 0, rotateZ: 0, opacity: 1, duration: 0.85, stagger: { each: 0.022, from: 'random' } },
      0,
    )
      .fromTo('.pre-ring', { rotateY: -70 }, { rotateY: 30, duration: 1.3, ease: 'power2.out' }, 0)
      .to(num, { v: 100, duration: 1.15, ease: 'power2.inOut', onUpdate: () => count.current && (count.current.textContent = String(Math.round(num.v)).padStart(2, '0')) }, 0.05)
      .fromTo('.pre-bar', { scaleX: 0 }, { scaleX: 1, duration: 1.15, ease: 'power2.inOut' }, 0.05)
      .add(finish, 1.25)
      .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.35, ease: 'quart.inOut' }, 1.25);

    const skip = () => tl.progress(1);
    window.addEventListener('keydown', skip, { once: true });
    el.addEventListener('pointerdown', skip, { once: true });
    return () => {
      window.removeEventListener('keydown', skip);
      tl.kill();
    };
  }, []);

  return (
    <div id="preloader" ref={root} className="bg-dots fixed inset-0 z-[140] flex flex-col items-center justify-center gap-10 bg-cream" style={{ clipPath: 'inset(0% 0% 0% 0%)' }} role="status" aria-label="Loading">
      <div className="h-[150px] w-full" style={{ perspective: 900 }} aria-hidden>
        <div className="relative size-full" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(-170px) rotateX(-8deg)' }}>
          <div className="pre-ring absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
            {Array.from({ length: COUNT }, (_, i) => (
              <div key={i} className="absolute left-1/2 top-1/2 -ml-[26px] -mt-[35px] h-[70px] w-[52px]" style={{ transformStyle: 'preserve-3d', transform: `rotateY(${i * 20}deg) translateZ(170px)` }}>
                <div className={`pre-card size-full rounded-[10px] opacity-0 ${i % 3 === 0 ? 'bg-brand' : i % 3 === 1 ? 'bg-ink' : 'border border-line bg-paper'}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex w-[220px] flex-col items-center gap-3">
        <Logo />
        <div className="h-px w-full overflow-hidden bg-line">
          <div className="pre-bar h-full origin-left scale-x-0 bg-brand" />
        </div>
        <p className="mono text-ink-60">
          <span ref={count}>00</span>%
        </p>
      </div>
      <p className="mono absolute bottom-6 text-ink-60">Tap to skip</p>
    </div>
  );
}
