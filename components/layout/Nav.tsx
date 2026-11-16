'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { brand } from '@/brand/brand.config';
import { TLink } from '@/components/providers/Transition';
import { ArrowUpRight } from '@/components/ui/Icons';
import { Logo } from '@/components/ui/Logo';
import { Magnetic } from '@/components/ui/Magnetic';
import { cn } from '@/lib/cn';

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 320);
        last = y;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <>
      <a href="#main" className="btn btn-ink btn-sm fixed left-4 top-4 z-[120] -translate-y-24 focus:translate-y-0">
        Skip to content
      </a>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[100] transition-transform duration-500 ease-[var(--ease-out-expo)]',
          hidden && !open ? '-translate-y-full' : 'translate-y-0',
        )}
      >
        <div
          className={cn(
            'transition-[background-color,backdrop-filter,box-shadow] duration-500',
            scrolled && !open ? 'bg-paper/70 shadow-[0_1px_0_0_var(--line)] backdrop-blur-xl' : 'bg-transparent',
          )}
        >
          <div className="wrap flex h-[var(--nav-h)] items-center justify-between gap-4">
            <TLink href="/" aria-label={`${brand.name} home`} className="relative z-10 shrink-0">
              <Logo />
            </TLink>

            <nav aria-label="Primary" className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
              <ul className="flex items-center gap-0.5 rounded-full border border-line/70 bg-paper p-1.5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)]">
                {brand.nav.map((item) => (
                  <li key={item.href}>
                    <TLink
                      href={item.href}
                      aria-current={isActive(item.href) ? 'page' : undefined}
                      className={cn(
                        'block rounded-full px-4 py-2 text-[14px] font-medium transition-colors duration-300',
                        isActive(item.href) ? 'bg-brand text-on-brand' : 'text-ink hover:bg-cream',
                      )}
                    >
                      {item.label}
                    </TLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              <Magnetic className="hidden sm:inline-block">
                <TLink href={brand.primaryCta.href} className="btn btn-outline btn-sm bg-paper">
                  {brand.primaryCta.label}
                  <ArrowUpRight size={16} />
                </TLink>
              </Magnetic>
              <button
                type="button"
                className="relative z-10 grid size-11 place-items-center rounded-full border border-line bg-paper lg:hidden"
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? 'Close menu' : 'Open menu'}
                onClick={() => setOpen((v) => !v)}
              >
                <span className="relative block h-3 w-5" aria-hidden>
                  <span className={cn('absolute inset-x-0 top-0 h-0.5 bg-ink transition-transform duration-300', open && 'translate-y-[5px] rotate-45')} />
                  <span className={cn('absolute inset-x-0 bottom-0 h-0.5 bg-ink transition-transform duration-300', open && '-translate-y-[5px] -rotate-45')} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={cn(
          'bg-dots fixed inset-0 z-[90] flex flex-col bg-cream px-5 pb-8 pt-[calc(var(--nav-h)+16px)] transition-[clip-path,visibility] duration-500 ease-[var(--ease-in-out-quart)] lg:hidden',
          open ? 'visible [clip-path:inset(0_0_0_0)]' : 'invisible [clip-path:inset(0_0_100%_0)]',
        )}
        aria-hidden={!open}
      >
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto">
          <ul className="flex flex-col">
            {brand.nav.map((item, i) => (
              <li key={item.href} className="border-b border-line">
                <TLink
                  href={item.href}
                  tabIndex={open ? 0 : -1}
                  className="display flex items-center justify-between py-4 text-[2.1rem]"
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  <span className={cn(isActive(item.href) && 'text-brand')}>{item.label}</span>
                  <span className="mono text-ink-60">0{i + 1}</span>
                </TLink>
              </li>
            ))}
          </ul>
        </nav>
        <TLink href={brand.primaryCta.href} tabIndex={open ? 0 : -1} className="btn btn-brand mt-6 w-full">
          {brand.primaryCta.label}
          <ArrowUpRight size={18} />
        </TLink>
      </div>
    </>
  );
}
