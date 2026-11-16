import { copy } from '@/brand/copy';
import { Marquee } from '@/components/ui/Marquee';

/** Two marquees in opposite directions: short lines, then channel names (BRIEF §2 row 11). */
export function Taglines({ channelNames }: { channelNames: string[] }) {
  return (
    <section className="overflow-hidden bg-paper py-[clamp(48px,7vw,96px)]" aria-label="Taglines">
      <Marquee duration={48} gap={40}>
        {copy.taglines.top.map((t) => (
          <span key={t} className="display flex shrink-0 items-center gap-10 text-[clamp(2.6rem,6vw,5.5rem)]">
            {t}
            <span className="inline-block size-4 rounded-full bg-brand sm:size-5" aria-hidden />
          </span>
        ))}
      </Marquee>
      <Marquee reverse duration={60} gap={28} className="mt-4">
        {channelNames.map((n) => (
          <span key={n} className="display flex shrink-0 items-center gap-7 text-[clamp(2rem,4.2vw,3.8rem)] text-transparent [-webkit-text-stroke:1.5px_var(--ink)]">
            {n}
            <span className="text-brand [-webkit-text-stroke:0]" aria-hidden>
              ✳
            </span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}
