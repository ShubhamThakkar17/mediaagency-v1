import { brand } from '@/brand/brand.config';
import { copy } from '@/brand/copy';
import { TLink } from '@/components/providers/Transition';
import { ArrowUpRight } from '@/components/ui/Icons';
import { Magnetic } from '@/components/ui/Magnetic';
import type { ChannelLite } from '@/lib/types';
import { ChannelCylinder } from './ChannelCylinder';
import { Preloader } from './Preloader';

export function Hero({ channels }: { channels: ChannelLite[] }) {
  let w = 0;
  return (
    <section data-hero-scroll data-hide-floating-cta className="hero-scroll relative bg-paper" aria-labelledby="hero-title">
      <div className="hero-sticky bg-dots grain flex flex-col justify-center overflow-hidden bg-paper pb-[clamp(28px,4vh,64px)] pt-[calc(var(--nav-h)+4px)]">
      <Preloader />
      <div className="glow -bottom-[38%] left-1/2 h-[70%] w-[78%] -translate-x-1/2" aria-hidden />
      <div className="relative flex flex-col">
        <div>
          <ChannelCylinder channels={channels} />
        </div>
        <div data-hero-copy className="wrap flex flex-col items-center pt-[clamp(14px,2.6vh,32px)] text-center">
          <h1 id="hero-title" className="display max-w-[15ch] text-[clamp(2.4rem,min(6.4vw,9.5vh),6.4rem)] font-medium md:max-w-none">
            {copy.hero.headline.map((line, li) => (
              <span key={line} className={li === 2 ? 'block' : 'inline'}>
                {line.split(' ').map((word) => (
                  <span key={word + w} className="hero-word" style={{ ['--i' as string]: w++ }}>
                    <span>{li === 2 && word.startsWith('state') ? <b>{word}</b> : word}&nbsp;</span>
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p className="lede hero-fade mt-[clamp(10px,2vh,24px)] max-w-[58ch] max-sm:text-[15px]">{copy.hero.sub}</p>
          <div className="hero-fade mt-[clamp(14px,2.6vh,32px)] flex flex-wrap items-center justify-center gap-3">
            <Magnetic>
              <TLink href={brand.primaryCta.href} className="btn btn-brand">
                {copy.hero.primary} <ArrowUpRight size={18} />
              </TLink>
            </Magnetic>
            <TLink href="/channels" className="btn btn-outline bg-paper/60">
              {copy.hero.secondary}
            </TLink>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
