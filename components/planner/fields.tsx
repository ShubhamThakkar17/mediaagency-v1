'use client';
import { useEffect, useId, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { formatINRCompact, groupIndian, parseINR } from '@/lib/format-inr';

export function Field({ label, children, hint, htmlFor }: { label: string; children: ReactNode; hint?: string; htmlFor?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="mono text-ink-60">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-ink-60">{hint}</p> : null}
    </div>
  );
}

export function Select<T extends string | number>({ id, value, onChange, options, className }: { id?: string; value: T; onChange: (v: T) => void; options: { value: T; label: string }[]; className?: string }) {
  return (
    <div className={cn('relative', className)}>
      <select
        id={id}
        value={String(value)}
        onChange={(e) => {
          const o = options.find((op) => String(op.value) === e.target.value);
          if (o) onChange(o.value);
        }}
        className="h-12 w-full appearance-none rounded-2xl border border-line bg-paper pl-4 pr-10 text-[15px] font-medium transition-colors hover:border-ink focus:border-ink"
      >
        {options.map((o) => (
          <option key={String(o.value)} value={String(o.value)}>
            {o.label}
          </option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" width="12" height="12" viewBox="0 0 12 12" aria-hidden>
        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function Segmented<T extends string | number>({ value, onChange, options, label, size = 'md' }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[]; label: string; size?: 'md' | 'lg' }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex w-full rounded-full border border-line bg-paper p-1">
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'flex-1 whitespace-nowrap rounded-full px-3 font-medium transition-colors duration-300',
            size === 'lg' ? 'h-12 text-[15px]' : 'h-10 text-sm',
            value === o.value ? 'bg-ink text-paper' : 'text-ink hover:bg-cream',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function ChipToggle({ pressed, onClick, children, tone = 'ink' }: { pressed: boolean; onClick: () => void; children: ReactNode; tone?: 'ink' | 'brand' | 'strike' }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn('chip', pressed && tone === 'brand' && '!border-brand !bg-brand !text-on-brand', pressed && tone === 'strike' && '!border-line !bg-mist !text-ink-60 line-through')}
    >
      {children}
    </button>
  );
}

const MIN = 1e5;
const MAX = 1e8;
const toSlider = (v: number) => Math.round((Math.log(v / MIN) / Math.log(MAX / MIN)) * 1000);
const fromSlider = (s: number) => {
  const raw = MIN * Math.pow(MAX / MIN, s / 1000);
  const step = raw >= 1e7 ? 5e5 : raw >= 1e6 ? 5e4 : 1e4;
  return Math.round(raw / step) * step;
};

/** Log-scale INR slider (₹1 L to ₹10 Cr) with an Indian-formatted numeric input. */
export function BudgetInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const id = useId();
  const [text, setText] = useState(groupIndian(value));
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (!focused) setText(groupIndian(value));
  }, [value, focused]);
  const pct = toSlider(value) / 10;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-4">
        <label htmlFor={`${id}-num`} className="mono text-ink-60">
          Total budget
        </label>
        <span className="display text-[2rem] font-semibold leading-none" aria-hidden>
          {formatINRCompact(value)}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={1000}
        step={1}
        value={toSlider(value)}
        onChange={(e) => onChange(fromSlider(Number(e.target.value)))}
        aria-label="Budget"
        aria-valuetext={formatINRCompact(value)}
        className="budget-range"
        style={{ ['--pct' as string]: `${pct}%` }}
      />
      <div className="mono flex justify-between !text-[10px] text-ink-60" aria-hidden>
        <span>₹1 L</span>
        <span>₹10 L</span>
        <span>₹1 Cr</span>
        <span>₹10 Cr</span>
      </div>
      <div className="flex h-12 items-center rounded-2xl border border-line bg-paper px-4 focus-within:border-ink">
        <span className="mr-1 text-ink-60">₹</span>
        <input
          id={`${id}-num`}
          inputMode="numeric"
          value={text}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            setText(groupIndian(value));
          }}
          onChange={(e) => {
            setText(e.target.value);
            const n = parseINR(e.target.value);
            if (n && n >= MIN) onChange(Math.min(MAX, n));
          }}
          className="min-w-0 flex-1 bg-transparent text-[15px] font-medium focus:outline-none"
          aria-describedby={`${id}-hint`}
        />
        <span id={`${id}-hint`} className="text-xs text-ink-60">
          e.g. 25L, 1.5 Cr
        </span>
      </div>
    </div>
  );
}
