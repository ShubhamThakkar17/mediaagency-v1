import { copy } from '@/brand/copy';
import { TLink } from '@/components/providers/Transition';
import { ArrowUpRight } from '@/components/ui/Icons';
import { SmartMedia } from '@/components/ui/SmartMedia';
import { cn } from '@/lib/cn';
import type { CatchupType } from '@/lib/catchup';
import type { GlyphId, MediaRef } from '@/lib/types';

export type PostCardData = {
  slug: string;
  type: CatchupType;
  typeLabel: string;
  title: string;
  excerpt: string;
  date: string;
  readMinutes: number;
  cover: MediaRef;
  glyph: GlyphId;
  demo: boolean;
  /** Case studies: the headline result. */
  result?: { value: string; label: string };
};

const TYPE_TONE: Record<CatchupType, string> = {
  article: 'bg-paper text-ink',
  'case-study': 'bg-brand text-on-brand',
  guide: 'bg-ink text-paper',
  'market-update': 'bg-brand-100 text-ink',
};

export const formatPostDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export function PostCard({ post, size = 'md' }: { post: PostCardData; size?: 'md' | 'lg' }) {
  const lg = size === 'lg';
  return (
    <TLink href={`/catchup/${post.slug}`} className={cn('group flex h-full flex-col overflow-hidden rounded-[26px] bg-cream', lg && 'lg:grid lg:grid-cols-[1.2fr_1fr]')} data-cursor="Read">
      <div className="relative overflow-hidden">
        <SmartMedia
          media={post.cover}
          glyph={post.glyph}
          className={cn('transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]', lg ? 'aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[420px]' : 'aspect-[16/10]')}
          sizes={lg ? '(min-width:1024px) 60vw, 100vw' : '(min-width:1024px) 30vw, (min-width:640px) 45vw, 90vw'}
        />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className={cn('mono rounded-full px-3 py-1.5 !text-[10px]', TYPE_TONE[post.type])}>{post.typeLabel}</span>
          {post.demo ? <span className="mono rounded-full bg-paper/90 px-3 py-1.5 !text-[10px] text-ink">{copy.catchup.concept}</span> : null}
        </div>
      </div>
      <div className={cn('flex flex-1 flex-col p-6', lg && 'lg:p-10')}>
        <p className="mono text-ink-60">
          {formatPostDate(post.date)} · {post.readMinutes} min
        </p>
        <h3 className={cn('display mt-3 font-semibold leading-[1.05]', lg ? 'text-[clamp(1.8rem,3vw,2.8rem)]' : 'text-[1.5rem]')}>{post.title}</h3>
        <p className={cn('mt-3 leading-relaxed text-ink-60', lg ? 'text-[16px]' : 'text-[15px]')}>{post.excerpt}</p>
        {post.result ? (
          <p className="mt-5 flex items-baseline gap-2 border-t border-line pt-4">
            <span className="display text-[1.8rem] font-semibold leading-none text-ink">{post.result.value}</span>
            <span className="text-[13px] text-ink-60">{post.result.label}</span>
          </p>
        ) : null}
        <span className="mt-auto inline-flex items-center gap-2 pt-6 font-medium">
          {copy.catchup.read} <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:rotate-45" />
        </span>
      </div>
    </TLink>
  );
}
