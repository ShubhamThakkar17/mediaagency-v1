'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * One observer for every [data-reveal] element on the page: adds .is-in the
 * first time an element enters the viewport (styles in globals.css).
 */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const seen = new WeakSet<Element>();
    // A fully clipped element reports no intersection, so clip reveals observe their parent.
    const proxies = new WeakMap<Element, Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const el = proxies.get(e.target) ?? e.target;
            el.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );
    const scan = () => {
      document.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => {
        if (!seen.has(el)) {
          seen.add(el);
          const target = el.getAttribute('data-reveal') === 'clip' && el.parentElement ? el.parentElement : el;
          if (target !== el) proxies.set(target, el);
          io.observe(target);
        }
      });
    };
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);
  return null;
}
