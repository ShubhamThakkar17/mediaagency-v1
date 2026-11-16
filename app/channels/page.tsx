import type { Metadata } from 'next';
import { ChannelGrid } from '@/components/channel/ChannelGrid';
import { Heatmap } from '@/components/channel/Heatmap';
import { Emph } from '@/components/ui/Emph';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MARKET_FIGURES } from '@/data/market';
import { getAllChannels, getChannelsLite } from '@/lib/channels';
import { visibleFigures } from '@/lib/demo-guard';

export const metadata: Metadata = {
  title: 'Channels',
  description: 'Eighteen media channels across India, from print, TV and radio to metros, airports, creators and search. Formats, audiences and indicative costs for each.',
  alternates: { canonical: '/channels' },
};

export default function ChannelsPage() {
  const all = getAllChannels();
  const figures = visibleFigures(MARKET_FIGURES).filter((f) => ['adex-2025', 'adex-2026', 'tv-2025', 'print-2025', 'outdoor-2025', 'radio-2025', 'cinema-2025', 'sports-2025'].includes(f.id));
  return (
    <>
      <PageHero label="Channel universe" title={<Emph text="Every channel *India watches.*" />} lede="Eighteen channels in six families. Filter by family, open any card for formats, audiences, funnel role and indicative costs." />
      <section className="bg-paper pb-[clamp(72px,9vw,140px)]">
        <div className="wrap">
          <ChannelGrid channels={getChannelsLite()} />
        </div>
      </section>
      <section className="section bg-cream">
        <div className="wrap">
          <SectionHeading label="Who each channel reaches" title={<Emph text="The audience *heatmap.*" />} lede="Affinity scores from 1 to 5 for eight audiences. These are planning assumptions our team refines for each brief." />
          <div className="mt-12">
            <Heatmap channels={all} />
          </div>
        </div>
      </section>
      {figures.length ? (
        <section className="section bg-paper">
          <div className="wrap">
            <SectionHeading label="Market context" title={<Emph text="Where India’s *ad rupee goes.*" />} />
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {figures.map((f) => (
                <li key={f.id} className="flex flex-col justify-between rounded-[24px] border border-line p-6" data-reveal="fade">
                  <p className="display text-[2rem] font-semibold leading-none">{f.value}</p>
                  <div className="mt-6">
                    <p className="text-[15px] font-medium">{f.label}</p>
                    {f.note ? <p className="text-[13px] text-ink-60">{f.note}</p> : null}
                    <a href={f.source.url} target="_blank" rel="noopener noreferrer" className="mono mt-3 block !normal-case !tracking-normal !text-[11px] text-ink-60 underline decoration-brand underline-offset-4">
                      {f.source.publisher}, {f.source.year}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
