import { copy } from '@/brand/copy';
import { demoResults } from '@/content/demo';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { Emph } from '@/components/ui/Emph';
import { RollingNumber } from '@/components/ui/RollingNumber';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/cn';
import { renderable } from '@/lib/demo-guard';

/** Bento of slot-machine numbers (BRIEF §2 row 7). Demo values. */
export function Results() {
  const items = renderable(demoResults, 'Results bento');
  return (
    <section className="section bg-paper" aria-labelledby="results-title">
      <div className="wrap">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading label={copy.results.label} id="results-title" title={<Emph text={copy.results.title} />} lede={copy.results.lede} />
          <DemoBadge />
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {items.map((r, i) => (
            <article
              key={r.id}
              data-reveal="fade"
              style={{ ['--reveal-delay' as string]: `${i * 0.08}s` }}
              className={cn(
                'relative flex min-h-[230px] flex-col justify-between overflow-hidden rounded-[26px] p-7',
                r.size === 'lg' ? 'bg-brand text-on-brand sm:col-span-2 lg:row-span-2' : 'bg-cream',
              )}
            >
              {r.badge ? <span className="absolute right-6 top-6 rounded-full bg-ink px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-paper">{r.badge}</span> : null}
              <span className={cn('display font-semibold leading-none', r.size === 'lg' ? 'text-[clamp(6rem,14vw,12rem)]' : 'text-[clamp(3.6rem,6vw,5rem)]')}>
                {r.prefix}
                <RollingNumber value={r.value} />
                {r.suffix}
              </span>
              <div>
                <h3 className={cn('display font-semibold', r.size === 'lg' ? 'text-3xl' : 'text-xl')}>{r.title}</h3>
                <p className={cn('mt-2 max-w-[38ch] text-[15px] leading-relaxed', r.size === 'lg' ? 'text-on-brand/80' : 'text-ink-60')}>{r.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
