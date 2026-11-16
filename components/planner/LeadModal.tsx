'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { track } from '@/lib/analytics';
import { leadClientSchema, type LeadClientInput } from '@/lib/lead-schema';

const inputCls = 'h-12 w-full rounded-2xl border border-line bg-paper px-4 text-[15px] transition-colors hover:border-ink focus:border-ink focus:outline-none';

export function LeadForm({ context, onDone, submitLabel = 'Send to our team', extraFields = false }: { context?: Record<string, unknown>; onDone?: () => void; submitLabel?: string; extraFields?: boolean }) {
  const [status, setStatus] = useState<'idle' | 'done' | 'error'>('idle');
  const { register, handleSubmit, formState } = useForm<LeadClientInput>({ resolver: zodResolver(leadClientSchema) });
  const onSubmit = async (data: LeadClientInput) => {
    try {
      const res = await fetch('/api/lead', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...data, kind: context ? 'plan' : 'contact', context }) });
      if (!res.ok) throw new Error();
      track('lead_submit', { kind: context ? 'plan' : 'contact' });
      setStatus('done');
      onDone?.();
    } catch {
      setStatus('error');
    }
  };
  if (status === 'done')
    return (
      <div className="rounded-[22px] bg-brand-100 p-6" role="status" data-testid="lead-success">
        <p className="display text-2xl font-semibold">Thank you. We have your details.</p>
        <p className="mt-2 text-ink-60">Someone from our planning team will call you within one working day.</p>
      </div>
    );
  const err = formState.errors;
  const field = (name: keyof LeadClientInput, label: string, type = 'text', auto?: string) => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={`lead-${name}`} className="mono text-ink-60">
        {label}
      </label>
      <input id={`lead-${name}`} type={type} autoComplete={auto} className={inputCls} aria-invalid={!!err[name]} {...register(name)} />
      {err[name] ? <span className="text-xs text-[#B42318]">{String(err[name]?.message)}</span> : null}
    </div>
  );
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2" noValidate>
      {field('name', 'Name', 'text', 'name')}
      {field('company', 'Company', 'text', 'organization')}
      {field('phone', 'Phone', 'tel', 'tel')}
      {field('email', 'Email', 'email', 'email')}
      {field('city', 'City', 'text', 'address-level2')}
      {extraFields ? (
        <>
          {field('industry', 'Industry')}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="lead-budget" className="mono text-ink-60">
              Budget band
            </label>
            <select id="lead-budget" className={inputCls} {...register('budgetBand')}>
              <option value="">Select</option>
              <option>Under ₹5 L</option>
              <option>₹5 L to ₹25 L</option>
              <option>₹25 L to ₹1 Cr</option>
              <option>Above ₹1 Cr</option>
            </select>
          </div>
        </>
      ) : null}
      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <label htmlFor="lead-message" className="mono text-ink-60">
          Message
        </label>
        <textarea id="lead-message" rows={3} className={`${inputCls} h-auto py-3`} {...register('message')} />
      </div>
      <div className="hidden" aria-hidden>
        <label>
          Leave this empty <input tabIndex={-1} autoComplete="off" {...register('website')} />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button type="submit" disabled={formState.isSubmitting} className="btn btn-brand disabled:opacity-60">
          {formState.isSubmitting ? 'Sending…' : submitLabel}
        </button>
        {status === 'error' ? (
          <span className="text-sm text-[#B42318]" role="alert">
            Something went wrong. Please try again or WhatsApp us.
          </span>
        ) : null}
      </div>
    </form>
  );
}

export function LeadModal({ open, onClose, context }: { open: boolean; onClose: () => void; context?: Record<string, unknown> }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.querySelector<HTMLElement>('input')?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      prev?.focus();
    };
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-[130] grid place-items-center bg-ink/50 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-title"
            className="max-h-[90vh] w-full max-w-[640px] overflow-y-auto rounded-[28px] bg-cream p-6 sm:p-9"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <span className="pill-label">Detailed plan</span>
                <h2 id="lead-title" className="display mt-4 text-[2rem] font-semibold leading-tight">
                  Get a detailed plan from our team
                </h2>
                <p className="mt-2 text-ink-60">We will send city-level options, real rates and a calendar.</p>
              </div>
              <button type="button" onClick={onClose} className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-paper" aria-label="Close">
                ✕
              </button>
            </div>
            <LeadForm context={context} />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
