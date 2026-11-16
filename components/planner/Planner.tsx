'use client';
import { AnimatePresence, motion } from 'motion/react';
import { TLink } from '@/components/providers/Transition';
import { ArrowUpRight } from '@/components/ui/Icons';
import { cn } from '@/lib/cn';
import type { PlannerInput } from '@/lib/planner';
import type { ChannelLite } from '@/lib/types';
import { PlannerActions } from './Actions';
import { ChannelPicker } from './ChannelPicker';
import { BudgetInput, ChipToggle, Segmented } from './fields';
import { SharedInputs } from './PlannerInputs';
import { BudgetResults, ChannelsResults, EstimateBadge } from './Results';
import { usePlanner } from './usePlanner';

type Variant = 'full' | 'compact';

const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

/**
 * The two-way media planner (BRIEF §10). `full` is the /planner page (URL
 * state, every input, sticky results). `compact` is the home block and the
 * floating drawer: fewer inputs and a link that carries state to /planner.
 */
export function Planner({ channels, variant = 'full', initial }: { channels: ChannelLite[]; variant?: Variant; initial?: Partial<PlannerInput> }) {
  const full = variant === 'full';
  const { input, update, result, shareQuery } = usePlanner(channels, { syncUrl: full, initial });
  const setMode = (mode: PlannerInput['mode']) => update({ mode });

  const inputsPanel = (
    <div className="flex flex-col gap-7">
      <Segmented
        size="lg"
        label="Planner mode"
        value={input.mode}
        onChange={setMode}
        options={[
          { value: 'budget', label: 'I have a budget' },
          { value: 'channels', label: 'I know my channels' },
        ]}
      />
      <SharedInputs input={input} update={update} compact={!full} />
      {input.mode === 'budget' ? (
        <div className="flex flex-col gap-6">
          <BudgetInput value={input.budgetINR} onChange={(budgetINR) => update({ budgetINR })} />
          {full ? (
            <>
              <div className="flex flex-col gap-3">
                <span className="mono text-ink-60">Must include (optional)</span>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Must include">
                  {channels.map((c) => (
                    <ChipToggle key={c.slug} tone="brand" pressed={input.include.includes(c.slug)} onClick={() => update({ include: toggle(input.include, c.slug), exclude: input.exclude.filter((x) => x !== c.slug) })}>
                      {c.shortName}
                    </ChipToggle>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <span className="mono text-ink-60">Exclude (optional)</span>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Exclude">
                  {channels.map((c) => (
                    <ChipToggle key={c.slug} tone="strike" pressed={input.exclude.includes(c.slug)} onClick={() => update({ exclude: toggle(input.exclude, c.slug), include: input.include.filter((x) => x !== c.slug) })}>
                      {c.shortName}
                    </ChipToggle>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <span className="mono text-ink-60">Pick your channels ({input.channels.length} selected)</span>
          <ChannelPicker channels={channels} selected={input.channels} onToggle={(slug) => update({ channels: toggle(input.channels, slug) })} compact={!full} />
        </div>
      )}
    </div>
  );

  const resultsPanel = (
    <div className="flex flex-col gap-6 rounded-[28px] bg-cream p-5 sm:p-7" aria-live="polite" aria-label="Plan results">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="display text-[1.5rem] font-semibold">{input.mode === 'budget' ? 'Your recommended mix' : 'Your three scenarios'}</h2>
        <EstimateBadge />
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={input.mode} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
          {result.mode === 'budget' ? <BudgetResults plan={result} compact={!full} /> : <ChannelsResults plan={result} compact={!full} channels={channels} />}
        </motion.div>
      </AnimatePresence>
      {full ? (
        <PlannerActions result={result} shareQuery={shareQuery} channels={channels} />
      ) : (
        <TLink href={`/planner?${shareQuery()}`} className="btn btn-brand w-full" data-testid="open-full-planner">
          Open full planner <ArrowUpRight size={18} />
        </TLink>
      )}
    </div>
  );

  return (
    <div className={cn('grid gap-8', full ? 'lg:grid-cols-[1fr_1.05fr] lg:gap-12' : 'lg:grid-cols-[0.9fr_1.1fr] lg:gap-10')}>
      <div className={cn(full && 'pb-4')}>{inputsPanel}</div>
      <div className={cn(full && 'lg:sticky lg:top-[96px] lg:self-start')}>{resultsPanel}</div>
    </div>
  );
}
