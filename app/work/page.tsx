import type { Metadata } from 'next';
import { WorkGrid } from '@/components/pages/WorkGrid';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { Emph } from '@/components/ui/Emph';
import { PageHero } from '@/components/ui/PageHero';
import { demoCampaigns } from '@/content/demo';
import { getMedia } from '@/content/media';
import { getAllChannels } from '@/lib/channels';
import { renderable } from '@/lib/demo-guard';

export const metadata: Metadata = {
  title: 'Work',
  description: 'Concept campaigns showing how a joined-up media plan runs across channels and markets in India.',
  alternates: { canonical: '/work' },
};

export default function WorkPage() {
  const all = getAllChannels();
  const by = new Map(all.map((c) => [c.slug, c]));
  const items = renderable(demoCampaigns, 'Work grid').map((c) => ({
    ...c,
    channels: c.channels.map((s) => ({ slug: s, name: by.get(s)?.shortName ?? s })),
    media: getMedia(c.media),
    glyph: by.get(c.channels[0])?.glyph ?? 'hoardings',
  }));
  const used = new Set(items.flatMap((i) => i.channels.map((c) => c.slug)));
  const filters = all.filter((c) => used.has(c.slug)).map((c) => ({ slug: c.slug, name: c.shortName }));
  return (
    <>
      <PageHero label="Work" title={<Emph text="Campaigns *in motion.*" />} lede="Concept campaigns that show how we combine channels for different categories and markets. Each one is a worked example, not a client case study.">
        <DemoBadge />
      </PageHero>
      <section className="bg-paper pb-[clamp(72px,9vw,140px)]">
        <div className="wrap">
          <WorkGrid items={items} filters={filters} />
        </div>
      </section>
    </>
  );
}
