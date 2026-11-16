import { brand } from '@/brand/brand.config';
import { copy } from '@/brand/copy';
import { TLink } from '@/components/providers/Transition';
import { ArrowUpRight } from '@/components/ui/Icons';
import { Magnetic } from '@/components/ui/Magnetic';
import type { ChannelLite } from '@/lib/types';
import { ChannelCylinder } from './ChannelCylinder';
import { HeroParallax } from './HeroParallax';
import { Preloader } from './Preloader';

export function Hero({ channels }: { channels: ChannelLite[] }) {
  let w = 0;
  return (
    <section className="bg-dots grain relative overflow-hidden bg-paper pb-[clamp(56px,7vw,110px)] pt-[calc(var(--nav-h)+8px)]" aria-labelledby="hero-title">
      <Preloader />
      <div className="glow -bottom-[38%] left-1/2 h-[70%] w-[78%] -translate-x-1/2" aria-hidden />
      <div className="relative flex flex-col">
        <div className="order-2 md:order-1">
          <ChannelCylinder channels={channels} />
          <p className="mono mt-1 text-center text-ink-60 md:-mt-2">
            <span className="hidden md:inline">{copy.hero.label}</span>
            <span className="md:hidden">Swipe</span> · {channels.length} channels
          </p>
        </div>
        <HeroParallax className="wrap order-1 flex flex-col items-center pb-8 pt-6 text-center md:order-2 md:pb-0 md:pt-9">
          <h1 id="hero-title" className="display max-w-[15ch] text-[clamp(2.7rem,6.7vw,6.6rem)] font-medium md:max-w-none">
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
          <p className="lede hero-fade mt-6 max-w-[58ch]">{copy.hero.sub}</p>
          <div className="hero-fade mt-8 flex flex-wrap items-center justify-center gap-3">
            <Magnetic>
              <TLink href={brand.primaryCta.href} className="btn btn-brand">
                {copy.hero.primary} <ArrowUpRight size={18} />
              </TLink>
            </Magnetic>
            <TLink href="/channels" className="btn btn-outline bg-paper/60">
              {copy.hero.secondary}
            </TLink>
          </div>
        </HeroParallax>
      </div>
    </section>
  );
}
