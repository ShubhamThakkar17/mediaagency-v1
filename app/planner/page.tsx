import type { Metadata } from 'next';
import { Planner } from '@/components/planner/Planner';
import { Emph } from '@/components/ui/Emph';
import { PageHero } from '@/components/ui/PageHero';
import { getChannelsLite } from '@/lib/channels';

export const metadata: Metadata = {
  title: 'Media planner',
  description: 'Tell us your budget and get a channel mix, or pick your channels and see what they cost. An indicative, shareable media plan for India in seconds.',
  alternates: { canonical: '/planner' },
};

export default function PlannerPage() {
  return (
    <>
      <PageHero label="Media planner" title={<Emph text="Your budget. *Or your channels.*" />} lede="Two ways in. Start from a budget and we suggest the mix, or start from the channels you want and we show three ways to run them. Every result is shareable by link." />
      <section className="bg-paper pb-[clamp(72px,9vw,140px)]">
        <div className="wrap">
          <Planner channels={getChannelsLite()} variant="full" />
        </div>
      </section>
    </>
  );
}
