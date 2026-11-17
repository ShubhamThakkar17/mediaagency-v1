'use client';
import { useState } from 'react';
import { copy } from '@/brand/copy';
import { cn } from '@/lib/cn';
import type { CatchupType } from '@/lib/catchup';
import { PostCard, type PostCardData } from './PostCard';

/** Filter tabs by type, then a grid of posts. */
export function CatchupHub({ posts, types }: { posts: PostCardData[]; types: { id: CatchupType; label: string }[] }) {
  const [type, setType] = useState<CatchupType | 'all'>('all');
  const shown = posts.filter((p) => type === 'all' || p.type === type);
  const tabs = [{ id: 'all' as const, label: copy.catchup.all, count: posts.length }, ...types.map((t) => ({ ...t, count: posts.filter((p) => p.type === t.id).length }))].filter((t) => t.count > 0);
  return (
    <div>
      <div role="tablist" aria-label="Filter by type" className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={type === t.id} onClick={() => setType(t.id)} className={cn('chip !h-11 !px-5 !text-[14px]', type === t.id && '!border-brand !bg-brand !text-on-brand')}>
            {t.label}
            <span className="mono !text-[10px] opacity-70">{t.count}</span>
          </button>
        ))}
      </div>
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
        {shown.map((p) => (
          <li key={p.slug} data-reveal="fade">
            <PostCard post={p} />
          </li>
        ))}
      </ul>
    </div>
  );
}
