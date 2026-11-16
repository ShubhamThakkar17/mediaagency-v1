import { cn } from '@/lib/cn';

/** Animated step line (Plan → Buy → Create → Execute → Prove, or Listen → … → Measure). */
export function ProcessLine({ steps, tone = 'light' }: { steps: readonly { step: string; body: string }[]; tone?: 'light' | 'dark' }) {
  return (
    <ol className="relative grid gap-8 md:grid-cols-5 md:gap-4">
      <span className={cn('absolute left-[22px] top-0 h-full w-px md:left-0 md:top-[22px] md:h-px md:w-full', tone === 'dark' ? 'bg-white/20' : 'bg-line')} aria-hidden />
      <span data-reveal="fade" className="bar-grow absolute left-0 top-[21px] hidden h-[2px] w-full bg-brand md:block" style={{ ['--reveal-delay' as string]: '0.1s' }} aria-hidden />
      {steps.map((s, i) => (
        <li key={s.step} className="relative flex gap-5 md:flex-col md:gap-4" data-reveal="fade" style={{ ['--reveal-delay' as string]: `${0.2 + i * 0.12}s` }}>
          <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full bg-brand font-display font-semibold text-on-brand">{i + 1}</span>
          <span>
            <span className="display block text-[1.4rem] font-semibold">{s.step}</span>
            <span className={cn('mt-1 block text-[14.5px] leading-relaxed', tone === 'dark' ? 'text-white/70' : 'text-ink-60')}>{s.body}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
