import { brand } from '@/brand/brand.config';
import { copy } from '@/brand/copy';
import { demoCampaigns, demoRating, demoTestimonials, demoMapStats } from '@/content/demo';
import { INDUSTRY_CONTENT } from '@/content/industries';
import { getMedia } from '@/content/media';
import { About } from '@/components/sections/About';
import { CampaignTable } from '@/components/sections/CampaignTable';
import { CatchupTeaser } from '@/components/sections/CatchupTeaser';
import { getAllPosts } from '@/lib/catchup';
import { toCards } from '@/lib/catchup-cards';
import { ChannelUniverse } from '@/components/sections/ChannelUniverse';
import { FeatureStack } from '@/components/sections/FeatureStack';
import { Hero } from '@/components/sections/hero/Hero';
import { IndiaMap } from '@/components/sections/IndiaMap';
import { Industries } from '@/components/sections/Industries';
import { LogoMarquee } from '@/components/sections/LogoMarquee';
import { PlannerBlock } from '@/components/sections/PlannerBlock';
import { Results } from '@/components/sections/Results';
import { Services } from '@/components/sections/Services';
import { SocialRow } from '@/components/sections/SocialRow';
import { StatsMarquee } from '@/components/sections/StatsMarquee';
import { Taglines } from '@/components/sections/Taglines';
import { Testimonials } from '@/components/sections/Testimonials';
import { Emph } from '@/components/ui/Emph';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CATEGORIES } from '@/data/categories';
import { industryLabel } from '@/data/industries';
import { marketFigure } from '@/data/market';
import { getAllChannels, getChannelsLite } from '@/lib/channels';
import { renderable, renderableOne, visibleFigures } from '@/lib/demo-guard';
import { getIndiaStates } from '@/lib/india-map';

const UNIVERSE_VIDEO: Record<string, string> = { ATL: 'vid-printing-press', OOH: 'vid-city-traffic', Transit: 'vid-metro', Travel: 'vid-airport', Fame: 'vid-stadium', Digital: 'vid-phone-scroll' };

export default function Home() {
  const all = getAllChannels();
  const channels = getChannelsLite();
  const bySlug = new Map(all.map((c) => [c.slug, c]));

  const panels = CATEGORIES.map((cat) => {
    const list = all.filter((c) => c.category === cat.id);
    const video = getMedia(UNIVERSE_VIDEO[cat.id]);
    return {
      id: cat.id,
      label: cat.label,
      title: cat.title,
      bestFor: cat.bestFor,
      media: list[0].media.hero,
      video: video.src ? video : undefined,
      channels: list.map((c) => ({ slug: c.slug, name: c.name, glyph: c.glyph })),
    };
  });

  const industries = INDUSTRY_CONTENT.map((it) => ({
    id: it.id,
    label: industryLabel(it.id),
    description: it.description,
    channels: it.topChannels.map((s) => ({ slug: s, shortName: bySlug.get(s)?.shortName ?? s })),
    metrics: renderable(it.metrics, `Industry metrics: ${it.id}`),
    media: getMedia(it.media),
    glyph: bySlug.get(it.topChannels[0])?.glyph ?? 'hoardings',
  }));

  const campaigns = renderable(demoCampaigns, 'Campaigns table').map((c) => ({
    id: c.id,
    year: c.year,
    title: c.title,
    channels: c.channels.map((s) => bySlug.get(s)?.shortName ?? s).join(', '),
    markets: c.markets,
    media: getMedia(c.media),
    glyph: bySlug.get(c.channels[0])?.glyph ?? 'hoardings',
  }));

  // Media CatchUp teaser: the newest post of each of three different types.
  const posts = renderable(getAllPosts(), 'Media CatchUp teaser');
  const seen = new Set<string>();
  const teaser = toCards(posts.filter((p) => (seen.has(p.type) ? false : (seen.add(p.type), true))).slice(0, 3));

  const adex = marketFigure('adex-2025');
  const marketStat = adex && visibleFigures([adex]).length ? adex : null;

  return (
    <>
      <Hero channels={channels} />
      <StatsMarquee channelCount={channels.length} />
      <About />
      <Services />
      <ChannelUniverse panels={panels} />
      <section className="section bg-cream" aria-labelledby="map-title">
        <div className="wrap">
          <SectionHeading label={copy.map.label} id="map-title" title={<Emph text={copy.map.title} />} lede={copy.map.lede} />
          <div className="mt-12">
            <IndiaMap states={getIndiaStates()} hqCityId={brand.hq.cityId} stats={renderable(demoMapStats, 'Map counters')} />
          </div>
          {marketStat ? (
            <p className="mono mt-12 border-t border-line pt-6 !normal-case !tracking-normal !text-[13px] text-ink-60">
              <span className="font-semibold text-ink">{marketStat.label}: {marketStat.value}</span>
              {marketStat.note ? `, ${marketStat.note}` : ''}. Source:{' '}
              <a href={marketStat.source.url} target="_blank" rel="noopener noreferrer" className="underline decoration-brand underline-offset-4">
                {marketStat.source.report}
              </a>
            </p>
          ) : null}
        </div>
      </section>
      <Industries items={industries} />
      <PlannerBlock channels={channels} />
      <Results />
      <LogoMarquee />
      <div className="pt-[clamp(72px,9vw,140px)]">
        <FeatureStack media={copy.features.rows.map((r) => getMedia(r.media))} />
      </div>
      <CampaignTable rows={campaigns} />
      <CatchupTeaser posts={teaser} />
      <Taglines channelNames={all.map((c) => c.shortName)} />
      <Testimonials items={renderable(demoTestimonials, 'Testimonials')} rating={renderableOne(demoRating, 'Testimonial rating')} />
      <SocialRow />
    </>
  );
}
