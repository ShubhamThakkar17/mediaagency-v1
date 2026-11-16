'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { track } from '@/lib/analytics';
import { DEFAULT_INPUT, decodeState, encodeState, plan, type PlanResult, type PlannerInput } from '@/lib/planner';
import type { ChannelLite } from '@/lib/types';

/**
 * Planner state. With `syncUrl`, inputs are read from and written to the
 * address bar (replaceState), so any plan is shareable with one link.
 */
export function usePlanner(channels: ChannelLite[], opts: { syncUrl?: boolean; initial?: Partial<PlannerInput> } = {}) {
  const slugs = useMemo(() => channels.map((c) => c.slug), [channels]);
  const [input, setInput] = useState<PlannerInput>(() => ({ ...DEFAULT_INPUT, ...opts.initial }));
  const hydrated = useRef(false);

  useEffect(() => {
    if (!opts.syncUrl) {
      hydrated.current = true;
      return;
    }
    setInput(decodeState(new URLSearchParams(window.location.search), { slugs }));
    hydrated.current = true;
  }, [opts.syncUrl, slugs]);

  useEffect(() => {
    if (!opts.syncUrl || !hydrated.current) return;
    const qs = encodeState(input, { slugs });
    const url = `${window.location.pathname}${qs ? `?${qs}` : ''}`;
    if (url !== `${window.location.pathname}${window.location.search}`) window.history.replaceState(window.history.state, '', url);
  }, [input, opts.syncUrl, slugs]);

  const result: PlanResult = useMemo(() => plan(input, channels), [input, channels]);

  const lastMode = useRef(input.mode);
  useEffect(() => {
    if (lastMode.current !== input.mode) {
      lastMode.current = input.mode;
      track('planner_mode', { mode: input.mode });
    }
  }, [input.mode]);
  useEffect(() => {
    const t = setTimeout(() => track('planner_result', { mode: input.mode, industry: input.industry }), 1500);
    return () => clearTimeout(t);
  }, [result, input.mode, input.industry]);

  const update = (patch: Partial<PlannerInput>) => setInput((prev) => ({ ...prev, ...patch }));
  const shareQuery = () => encodeState(input, { slugs });
  return { input, setInput, update, result, shareQuery };
}
