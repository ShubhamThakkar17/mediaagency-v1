'use client';
import { useState } from 'react';
import { copy } from '@/brand/copy';
import { ArrowRight } from '@/components/ui/Icons';

/** Newsletter field. Posts to /api/lead as a "newsletter" lead; a no-op success when no env is set. */
export function Newsletter() {
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const [email, setEmail] = useState('');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('busy');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ kind: 'newsletter', email, name: 'Newsletter subscriber', source: 'footer' }),
      });
      setState(res.ok ? 'done' : 'error');
    } catch {
      setState('error');
    }
  };
  if (state === 'done') return <p className="text-sm text-white/80" role="status">{copy.footer.newsletterThanks}</p>;
  return (
    <form onSubmit={submit} className="flex max-w-sm items-center gap-2 rounded-full border border-white/20 p-1.5 pl-5">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={copy.footer.newsletterPlaceholder}
        className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none"
      />
      <button type="submit" disabled={state === 'busy'} aria-label={copy.footer.newsletterCta} className="grid size-10 shrink-0 place-items-center rounded-full bg-brand text-on-brand disabled:opacity-60">
        <ArrowRight size={16} />
      </button>
      {state === 'error' ? <span className="sr-only" role="alert">Something went wrong. Please try again.</span> : null}
    </form>
  );
}
