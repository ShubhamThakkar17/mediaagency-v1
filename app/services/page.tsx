import type { Metadata } from 'next';
import { copy } from '@/brand/copy';
import { ServicesList } from '@/components/pages/ServicesList';
import { TLink } from '@/components/providers/Transition';
import { Emph } from '@/components/ui/Emph';
import { ArrowUpRight } from '@/components/ui/Icons';
import { PageHero } from '@/components/ui/PageHero';
import { ProcessLine } from '@/components/ui/ProcessLine';
import { SERVICES } from '@/content/services';
import { getAllChannels } from '@/lib/channels';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Media planning and buying, creative and production, digital and performance, brand partnerships, on-ground activations, and PR. One team across India.',
  alternates: { canonical: '/services' },
};

export default function ServicesPage() {
  const names = Object.fromEntries(getAllChannels().map((c) => [c.slug, c.shortName]));
  return (
    <>
      <PageHero label="Services" title={<Emph text={copy.services.title} />} lede={copy.services.lede} />
      <section className="bg-paper pb-[clamp(72px,9vw,140px)]">
        <div className="wrap">
          <ServicesList services={SERVICES} channelNames={names} />
        </div>
      </section>
      <section className="section on-dark bg-ink text-paper">
        <div className="wrap">
          <span className="pill-label">How we run it</span>
          <h2 className="display t-2 mb-14 mt-6 max-w-[18ch]">From plan to proof, in five steps.</h2>
          <ProcessLine steps={copy.process} tone="dark" />
          <TLink href="/contact" className="btn btn-brand mt-16">
            Start a brief <ArrowUpRight size={18} />
          </TLink>
        </div>
      </section>
    </>
  );
}
