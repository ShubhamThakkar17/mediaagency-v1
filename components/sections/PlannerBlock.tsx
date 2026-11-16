import { copy } from '@/brand/copy';
import { Planner } from '@/components/planner/Planner';
import { Emph } from '@/components/ui/Emph';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { ChannelLite } from '@/lib/types';

export function PlannerBlock({ channels }: { channels: ChannelLite[] }) {
  return (
    <section id="planner" className="section bg-dots relative overflow-hidden bg-paper" aria-labelledby="planner-title">
      <div className="glow -right-[10%] top-[10%] h-[50%] w-[40%] !opacity-20" aria-hidden />
      <div className="wrap relative">
        <SectionHeading label={copy.plannerBlock.label} id="planner-title" title={<Emph text={copy.plannerBlock.title} />} lede={copy.plannerBlock.lede} />
        <div className="mt-12 rounded-[32px] border border-line bg-paper/80 p-5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)] backdrop-blur sm:p-8">
          <Planner channels={channels} variant="compact" />
        </div>
      </div>
    </section>
  );
}
