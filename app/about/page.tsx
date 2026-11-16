import type { Metadata } from 'next';
import { brand } from '@/brand/brand.config';
import { copy } from '@/brand/copy';
import { IndiaMap } from '@/components/sections/IndiaMap';
import { TLink } from '@/components/providers/Transition';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { Emph } from '@/components/ui/Emph';
import { ArrowUpRight } from '@/components/ui/Icons';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SmartMedia } from '@/components/ui/SmartMedia';
import { SplitHeading } from '@/components/ui/SplitHeading';
import { demoMapStats, demoTeam } from '@/content/demo';
import { getMedia } from '@/content/media';
import { renderable } from '@/lib/demo-guard';
import { getIndiaStates } from '@/lib/india-map';

export const metadata: Metadata = {
  title: 'About',
  description: `${brand.descriptor}. One team that plans, buys, creates and runs media across India.`,
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      <PageHero label="About us" title={<Emph text="One team for *every channel.*" />} lede={copy.about.body} />

      <section className="bg-paper pb-[clamp(72px,9vw,140px)]">
        <div className="wrap grid gap-5 md:grid-cols-[1.4fr_1fr]">
          <div data-reveal="clip" className="overflow-hidden rounded-[28px]">
            <SmartMedia media={getMedia('about-team')} glyph="data-chart" className="aspect-[16/11]" sizes="(min-width:768px) 58vw, 100vw" />
          </div>
          <div data-reveal="clip" className="overflow-hidden rounded-[28px]" style={{ ['--reveal-delay' as string]: '0.15s' }}>
            <SmartMedia media={getMedia('feature-pan-india')} glyph="india-pin" className="aspect-[16/11] md:aspect-auto md:h-full" sizes="(min-width:768px) 40vw, 100vw" />
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <SplitHeading as="h2" className="t-2 max-w-[14ch]">
            <Emph text="Why we built *one agency, not five.*" />
          </SplitHeading>
          <div className="space-y-5 text-[17px] leading-relaxed text-ink-60" data-reveal="fade">
            <p>Most brands in India juggle a media agency, a creative shop, a digital agency, an influencer desk and a local vendor for every city. Each one reports a different number. Nobody owns the whole plan.</p>
            <p>We put planning, buying, creative and execution in one team. The person who chose the hoarding in Surat can see the search queries it created. The creative is designed for the exact sites we bought. The report shows every channel against one goal.</p>
            <p>That is the whole idea. One plan, one team, one report, from a single city to all of India.</p>
          </div>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="wrap">
          <SectionHeading label="Our promises" title={<Emph text="Four things *we hold to.*" />} />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {copy.promises.map((p, i) => (
              <li key={p.title} className="flex min-h-[260px] flex-col justify-between rounded-[26px] bg-cream p-7" data-reveal="fade" style={{ ['--reveal-delay' as string]: `${i * 0.08}s` }}>
                <span className="mono text-ink-60">0{i + 1}</span>
                <div>
                  <h3 className="display text-[1.6rem] font-semibold leading-tight">{p.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-60">{p.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section on-dark relative overflow-hidden bg-ink text-paper">
        <div className="wrap relative">
          <span className="pill-label">How we work</span>
          <h2 className="display t-2 mt-6 max-w-[16ch]">Listen first. Measure always.</h2>
          <div className="relative mt-16">
            <svg viewBox="0 0 1000 120" preserveAspectRatio="none" className="absolute inset-x-0 top-[6px] hidden h-[90px] w-full md:block" aria-hidden>
              <path d="M0 60 C 100 0, 200 0, 300 60 S 500 120, 600 60 S 800 0, 1000 60" fill="none" stroke="var(--brand)" strokeWidth="3" strokeDasharray="6 10" />
            </svg>
            <ol className="relative grid gap-10 md:grid-cols-5 md:gap-6">
              {copy.howWeWork.map((s, i) => (
                <li key={s.step} className={i % 2 ? 'md:pt-20' : ''} data-reveal="fade" style={{ ['--reveal-delay' as string]: `${i * 0.1}s` }}>
                  <span className="grid size-12 place-items-center rounded-full bg-brand font-display font-semibold text-on-brand">{i + 1}</span>
                  <h3 className="display mt-5 text-[1.6rem] font-semibold">{s.step}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/70">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="wrap">
          <SectionHeading label={copy.map.label} title={<Emph text={copy.map.title} />} lede={copy.map.lede} />
          <div className="mt-12">
            <IndiaMap states={getIndiaStates()} hqCityId={brand.hq.cityId} stats={renderable(demoMapStats, 'About map counters')} compact />
          </div>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="wrap">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading label="The team" title={<Emph text="Specialists, *one table.*" />} lede="Our practice leads, by role. Names and faces arrive when the team is announced." />
            <DemoBadge />
          </div>
          <ul className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {renderable(demoTeam, 'Team strip').map((m) => (
              <li key={m.role} className="rounded-[24px] bg-cream p-5">
                <span className="grid aspect-square w-full place-items-center rounded-[18px] bg-brand font-display text-[2.6rem] font-semibold text-on-brand" aria-hidden>
                  {m.initials}
                </span>
                <p className="mt-4 font-semibold">{m.role}</p>
                <p className="text-[13px] text-ink-60">{m.focus}</p>
              </li>
            ))}
          </ul>
          <TLink href="/contact" className="btn btn-ink mt-14">
            Work with us <ArrowUpRight size={18} />
          </TLink>
        </div>
      </section>
    </>
  );
}
