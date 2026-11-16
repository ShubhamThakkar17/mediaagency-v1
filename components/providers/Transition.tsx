'use client';
import Link, { type LinkProps } from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react';
import { gsap } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/motion';

type NavigateOptions = { /** Expand the wipe from this element (card -> page hero). */ from?: Element | null };
type Ctx = { navigate: (href: string, opts?: NavigateOptions) => void };
const TransitionContext = createContext<Ctx>({ navigate: () => {} });
export const usePageTransition = () => useContext(TransitionContext);

/** Orange panel wipes up, the route changes underneath, the panel lifts away (≤ 600 ms). */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const pending = useRef(false);
  const safety = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reveal = useCallback(() => {
    if (!pending.current || !panel.current) return;
    pending.current = false;
    if (safety.current) clearTimeout(safety.current);
    gsap.to(panel.current, {
      clipPath: 'inset(0% 0% 100% 0% round 0px)',
      duration: 0.3,
      delay: 0.06,
      ease: 'quart.inOut',
      onComplete: () => gsap.set(panel.current, { visibility: 'hidden' }),
    });
  }, []);

  useEffect(() => {
    reveal();
  }, [pathname, reveal]);

  const navigate = useCallback(
    (href: string, opts?: NavigateOptions) => {
      const url = new URL(href, window.location.href);
      const samePage = url.pathname === window.location.pathname;
      if (samePage || prefersReducedMotion() || !panel.current || pending.current) {
        router.push(href);
        return;
      }
      pending.current = true;
      let fromClip = 'inset(100% 0% 0% 0% round 0px)';
      if (opts?.from) {
        const r = opts.from.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        fromClip = `inset(${Math.max(0, r.top)}px ${Math.max(0, vw - r.right)}px ${Math.max(0, vh - r.bottom)}px ${Math.max(0, r.left)}px round 24px)`;
      }
      gsap.killTweensOf(panel.current);
      gsap.fromTo(
        panel.current,
        { visibility: 'visible', clipPath: fromClip },
        {
          clipPath: 'inset(0px 0px 0px 0px round 0px)',
          duration: opts?.from ? 0.42 : 0.3,
          ease: 'quart.inOut',
          onComplete: () => router.push(href),
        },
      );
      safety.current = setTimeout(reveal, 4000);
    },
    [router, reveal],
  );

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div
        ref={panel}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[150] bg-brand"
        style={{ visibility: 'hidden', clipPath: 'inset(100% 0% 0% 0%)' }}
      />
    </TransitionContext.Provider>
  );
}

type TLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> &
  LinkProps & { href: string; /** Expand the transition from the link's own box. */ expand?: boolean };

/** next/link with the page-wipe transition. Falls back to normal navigation for modified clicks. */
export function TLink({ href, onClick, expand, children, ...rest }: TLinkProps) {
  const { navigate } = usePageTransition();
  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        if (/^(https?:|mailto:|tel:)/.test(href) || rest.target === '_blank') return;
        if (href.startsWith('#')) return;
        e.preventDefault();
        navigate(href, expand ? { from: e.currentTarget } : undefined);
      }}
    >
      {children}
    </Link>
  );
}
