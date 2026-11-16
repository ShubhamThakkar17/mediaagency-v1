import { copy } from '@/brand/copy';
import { demoStats } from '@/content/demo';
import { Counter } from '@/components/ui/Counter';
import { Marquee } from '@/components/ui/Marquee';
import { renderable } from '@/lib/demo-guard';

type Stat = { id: string; value: number; prefix?: string; suffix?: string; label: string };

/** Four orange counter cards in an infinite strip (BRIEF §2 row 3). The first stat is computed, not demo. */
export function StatsMarquee({ channelCount }: { channelCount: number }) {
  const stats: Stat[] = [{ id: 'channels', value: channelCount, label: copy.stats.channelsLabel }, ...renderable(demoStats, 'Stats marquee')];
  return (
    <section aria-label="Key numbers" className="relative bg-paper py-6">
      <Marquee duration={36} gap={16}>
        {stats.map((s) => (
          <div key={s.id} className="flex h-[150px] w-[290px] shrink-0 flex-col justify-between rounded-[24px] bg-brand p-6 text-on-brand sm:h-[170px] sm:w-[330px]">
            <span className="display text-[3.6rem] font-semibold leading-none sm:text-[4.2rem]">
              <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
            </span>
            <span className="text-[15px] font-medium">{s.label}</span>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
