'use client';
import { useEffect, useRef, useState } from 'react';
import { usePageTransition } from '@/components/providers/Transition';
import { PosterCard } from '@/components/ui/PosterCard';
import { ArrowRight } from '@/components/ui/Icons';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import type { ChannelLite } from '@/lib/types';
import './cylinder.css';

const FRICTION = 0.95;
const AUTO = 0.04; // deg per frame when idle
const MAX_V = 3.2;

/**
 * The hero centrepiece: a pure CSS 3D cylinder of channel posters with
 * velocity physics (drag, wheel, touch, keyboard). Below 768px, or under
 * reduced motion, CSS swaps it for a horizontal snap carousel.
 */
export function ChannelCylinder({ channels }: { channels: ChannelLite[] }) {
  const n = channels.length;
  const step = 360 / n;
  const root = useRef<HTMLDivElement>(null);
  const region = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);
  const { navigate } = usePageTransition();
  const [announce, setAnnounce] = useState('');
  const state = useRef({ angle: 0, scrollAngle: 0, scrollShown: 0, v: 0, dragging: false, hover: false, lastX: 0, moved: 0, snap: null as number | null, visible: true, focused: false, front: -1 });
  const caption = useRef<HTMLSpanElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const progress = useRef<HTMLSpanElement>(null);

  const frontIndex = () => ((Math.round(-(state.current.angle + state.current.scrollAngle) / step) % n) + n) % n;

  useEffect(() => {
    const el = region.current;
    const ringEl = ring.current;
    if (!el || !ringEl) return;
    const s = state.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let last = performance.now();

    const render = () => {
      const total = s.angle + s.scrollShown;
      ringEl.style.transform = `rotateY(${total}deg)`;
      for (let i = 0; i < n; i++) {
        const card = cardEls.current[i];
        if (!card) continue;
        const cos = Math.cos(((i * step + total) * Math.PI) / 180);
        const shade = card.lastElementChild as HTMLElement;
        shade.style.opacity = String(Math.round(((1 - cos) / 2) * 72) / 100);
        card.style.pointerEvents = cos > 0.55 ? 'auto' : 'none';
      }
      // Caption follows the card at the front of the ring.
      const f = ((Math.round(-total / step) % n) + n) % n;
      if (f !== s.front) {
        if (s.front >= 0) cardEls.current[s.front]?.removeAttribute('data-front');
        cardEls.current[f]?.setAttribute('data-front', 'true');
        s.front = f;
        if (caption.current) caption.current.textContent = channels[f].name;
        if (counter.current) counter.current.textContent = `${String(f + 1).padStart(2, '0')} / ${n}`;
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(3, (now - last) / 16.667);
      last = now;
      if (s.snap !== null) {
        const d = s.snap - s.angle;
        s.angle += d * Math.min(1, 0.16 * dt);
        s.v = 0;
        if (Math.abs(d) < 0.05) {
          s.angle = s.snap;
          s.snap = null;
        }
      } else if (!s.dragging) {
        s.angle += s.v * dt;
        s.v *= Math.pow(FRICTION, dt);
        if (Math.abs(s.v) < 0.002) s.v = 0;
        if (!s.hover && !s.focused && !reduced) s.angle -= AUTO * dt;
      }
      // Ease toward the scroll-driven angle so native (non-Lenis) scrolling stays smooth.
      s.scrollShown += (s.scrollAngle - s.scrollShown) * Math.min(1, 0.2 * dt);
      render();
      raf = s.visible && !document.hidden ? requestAnimationFrame(tick) : 0;
    };
    const start = () => {
      if (!raf && s.visible) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    const io = new IntersectionObserver(([e]) => {
      s.visible = e.isIntersecting;
      start();
    });
    io.observe(el);
    const onVis = () => start();
    document.addEventListener('visibilitychange', onVis);

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      s.dragging = true;
      s.snap = null;
      s.lastX = e.clientX;
      s.moved = 0;
      s.v = 0;
    };
    const onMove = (e: PointerEvent) => {
      if (!s.dragging) return;
      const dx = e.clientX - s.lastX;
      s.lastX = e.clientX;
      s.moved += Math.abs(dx);
      if (s.moved > 6 && !el.hasPointerCapture(e.pointerId)) {
        try {
          el.setPointerCapture(e.pointerId);
        } catch {}
        el.dataset.dragging = 'true';
      }
      const d = dx * 0.16;
      s.angle += d;
      s.v = Math.max(-MAX_V, Math.min(MAX_V, d));
    };
    const onUp = (e: PointerEvent) => {
      if (!s.dragging) return;
      s.dragging = false;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      setTimeout(() => delete el.dataset.dragging, 0);
    };
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // vertical scroll stays with the page
      e.preventDefault();
      s.snap = null;
      s.v = Math.max(-MAX_V, Math.min(MAX_V, s.v - e.deltaX * 0.012));
    };
    const onClickCapture = (e: MouseEvent) => {
      if (s.moved > 6) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const enter = () => (s.hover = true);
    const leave = () => (s.hover = false);

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('click', onClickCapture, true);
    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);
    render();
    // Start the physics loop once the browser is idle after load, so it never competes with hydration.
    type IdleWindow = Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    const w = window as IdleWindow;
    let idleId = 0;
    const kick = () => (idleId = w.requestIdleCallback ? w.requestIdleCallback(start, { timeout: 1500 }) : window.setTimeout(start, 600));
    if (document.readyState === 'complete') kick();
    else window.addEventListener('load', kick, { once: true });
    return () => {
      window.removeEventListener('load', kick);
      if (w.cancelIdleCallback) w.cancelIdleCallback(idleId);
      else clearTimeout(idleId);
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('click', onClickCapture, true);
      el.removeEventListener('mouseenter', enter);
      el.removeEventListener('mouseleave', leave);
    };
  }, [n, step, channels]);

  /*
   * Scroll roll. The hero sits in a tall wrapper ([data-hero-scroll]) with a
   * CSS-sticky inner screen, so the browser does the pinning (much cheaper
   * than a GSAP pin on phones). A passive scroll listener maps progress through
   * the wrapper to one full revolution, so every channel passes the front.
   */
  useEffect(() => {
    const wrap = root.current?.closest<HTMLElement>('[data-hero-scroll]');
    if (!wrap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const s = state.current;
    const onScroll = () => {
      const r = wrap.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      s.scrollAngle = -p * 360;
      if (progress.current) progress.current.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      s.scrollAngle = 0;
      s.scrollShown = 0;
    };
  }, []);

  // After the roll: the cylinder tilts back and fades, the headline drifts up faster than the page.
  useGSAP(
    () => {
      const wrap = root.current?.closest('[data-hero-scroll]');
      if (!wrap) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const copyEl = wrap.querySelector('[data-hero-copy]');
        const out = gsap.timeline({ scrollTrigger: { trigger: wrap, start: 'bottom bottom', end: 'bottom top+=30%', scrub: true } });
        out.to('.cyl-scroll', { rotateX: 16, scale: 0.8, autoAlpha: 0, yPercent: -6, ease: 'none' }, 0);
        if (copyEl) out.to(copyEl, { y: -90, ease: 'none' }, 0);
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 600);
    return () => clearTimeout(t);
  }, []);

  const rotateBy = (dir: 1 | -1) => {
    const s = state.current;
    const current = s.snap ?? Math.round((s.angle + s.scrollAngle) / step) * step - s.scrollAngle;
    s.snap = current - dir * step;
    const next = (((Math.round(-(s.snap + s.scrollAngle) / step) % n) + n) % n) as number;
    setAnnounce(`${channels[next].name}, ${next + 1} of ${n}`);
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      rotateBy(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      rotateBy(-1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const i = frontIndex();
      navigate(`/channels/${channels[i].slug}`, { from: cardEls.current[i] });
    }
  };

  return (
    <div ref={root} className="cyl-root">
      {/* 3D cylinder: desktop and tablet, motion allowed */}
      <div className="cyl-3d cyl-scroll">
        <div
          ref={region}
          className="cyl-viewport"
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label={`${n} media channels. Use the left and right arrow keys to rotate, Enter to open the front channel.`}
          data-cursor="Drag"
          data-testid="cylinder"
          onKeyDown={onKeyDown}
          onFocus={() => (state.current.focused = true)}
          onBlur={() => (state.current.focused = false)}
        >
          <div className="cyl-tilt">
            <div ref={ring} className="cyl-ring" data-testid="cylinder-ring">
              {channels.map((c, i) => (
                <div
                  key={c.slug}
                  ref={(el) => {
                    cardEls.current[i] = el;
                  }}
                  className="cyl-card"
                  style={{ transform: `rotateY(${i * step}deg) translateZ(var(--cyl-r))` }}
                >
                  <a
                    href={`/channels/${c.slug}`}
                    tabIndex={-1}
                    draggable={false}
                    className="cyl-card-inner"
                    aria-label={`${c.name}: explore`}
                    onClick={(e) => {
                      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                      e.preventDefault();
                      navigate(`/channels/${c.slug}`, { from: e.currentTarget });
                    }}
                  >
                    <PosterCard channel={c} sizes="260px" />
                    <span className="cyl-chip">
                      Explore <ArrowRight size={14} />
                    </span>
                  </a>
                  <div className="cyl-shade" aria-hidden />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="cyl-caption" aria-hidden>
          <span ref={counter} className="mono text-ink-60">
            01 / {n}
          </span>
          <span ref={caption} className="cyl-caption-name">
            {channels[0]?.name}
          </span>
          <span className="cyl-progress">
            <span ref={progress} />
          </span>
          <span className="mono text-ink-60">Scroll or drag to explore</span>
        </div>
        <p className="sr-only" aria-live="polite">
          {announce}
        </p>
      </div>

      {/* Fallback: horizontal snap carousel (small screens and reduced motion) */}
      <div className="cyl-flat" role="region" aria-roledescription="carousel" aria-label={`${n} media channels`}>
        <ul className="cyl-flat-track">
          {channels.map((c) => (
            <li key={c.slug} className="cyl-flat-item">
              <a href={`/channels/${c.slug}`} aria-label={`${c.name}: explore`} className="block" onClick={(e) => { e.preventDefault(); navigate(`/channels/${c.slug}`, { from: e.currentTarget }); }}>
                {/* Mobile shows glyph posters instead of photos so the headline stays the LCP element. */}
                <PosterCard channel={c.posterStyle === 'photo-duotone' ? { ...c, posterStyle: 'glyph-poster' } : c} sizes="(max-width:767px) 44vw, 200px" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
