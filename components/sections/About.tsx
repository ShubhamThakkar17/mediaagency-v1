import { copy } from '@/brand/copy';
import { getMedia } from '@/content/media';
import { demoAboutStats } from '@/content/demo';
import { TLink } from '@/components/providers/Transition';
import { Counter } from '@/components/ui/Counter';
import { Emph } from '@/components/ui/Emph';
import { ArrowUpRight } from '@/components/ui/Icons';
import { SmartMedia } from '@/components/ui/SmartMedia';
import { SplitHeading } from '@/components/ui/SplitHeading';
import { renderable } from '@/lib/demo-guard';
import { Parallax } from './Parallax';

export function About() {
  const [years, rating] = renderable(demoAboutStats, 'About stats');
  return (
    <section className="section bg-paper" aria-labelledby="about-title">
      <div className="wrap grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <div className="flex flex-col gap-7 lg:pt-10">
          <span className="pill-label self-start" data-reveal="fade">
            {copy.about.label}
          </span>
          <SplitHeading as="h2" id="about-title" className="t-1 max-w-[12ch]">
            <Emph text={copy.about.title} />
          </SplitHeading>
          <p className="display t-3 max-w-[22ch] text-ink" data-reveal="fade">
            {copy.about.lead}
          </p>
          <p className="lede max-w-[52ch]" data-reveal="fade">
            {copy.about.body}
          </p>
          <TLink href="/about" className="btn btn-ink self-start" data-reveal="fade">
            {copy.about.cta} <ArrowUpRight size={18} />
          </TLink>
        </div>

        <div className="relative grid grid-cols-[0.8fr_1.2fr] items-end gap-4 sm:gap-5">
          <Parallax speed={-60} className="relative">
            <div data-reveal="clip" className="overflow-hidden rounded-[24px]">
              <SmartMedia media={getMedia('about-portrait')} glyph="hoardings" className="aspect-[3/4.4]" sizes="(min-width:1024px) 22vw, 40vw" maxWidth={1000} />
            </div>
            {years ? (
              <div className="absolute -bottom-6 -right-5 z-10 w-[150px] rounded-[22px] bg-brand p-5 text-on-brand shadow-xl sm:w-[180px]">
                <span className="display block text-[3rem] font-semibold leading-none">
                  <Counter value={years.value} suffix={years.suffix} />
                </span>
                <span className="mt-2 block text-sm font-medium">{years.label}</span>
              </div>
            ) : null}
          </Parallax>
          <Parallax speed={40} className="relative">
            <div data-reveal="clip" className="overflow-hidden rounded-[24px]" style={{ ['--reveal-delay' as string]: '0.15s' }}>
              <SmartMedia media={getMedia('about-team')} glyph="data-chart" className="aspect-[4/5]" sizes="(min-width:1024px) 32vw, 58vw" />
            </div>
            {rating ? (
              <div className="absolute left-4 top-4 rounded-[20px] border border-white/40 bg-white/55 p-4 text-ink shadow-lg backdrop-blur-xl sm:left-6 sm:top-6 sm:p-5">
                <span className="display flex items-baseline gap-1 text-[2.4rem] font-semibold leading-none">
                  <Counter value={rating.value} decimals={1} />
                  <span className="text-lg text-brand" aria-hidden>
                    ★
                  </span>
                </span>
                <span className="mt-1 block max-w-[16ch] text-[13px] font-medium">{rating.label}</span>
              </div>
            ) : null}
          </Parallax>
        </div>
      </div>
    </section>
  );
}
