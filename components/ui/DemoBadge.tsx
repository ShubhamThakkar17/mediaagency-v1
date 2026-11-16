import { DEMO_MODE } from '@/lib/demo-guard';
import { copy } from '@/brand/copy';
import { cn } from '@/lib/cn';

/** Shown only while NEXT_PUBLIC_DEMO_MODE is on (the default). */
export function DemoBadge({ className, tone = 'light' }: { className?: string; tone?: 'light' | 'dark' }) {
  if (!DEMO_MODE) return null;
  return (
    <span
      data-demo-badge
      className={cn(
        'mono inline-flex items-center gap-2 rounded-full border px-3 py-1.5 !text-[10px]',
        tone === 'dark' ? 'border-white/25 text-white/75' : 'border-line bg-paper/70 text-ink-60',
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-brand" aria-hidden />
      {copy.demoBadge}
    </span>
  );
}
