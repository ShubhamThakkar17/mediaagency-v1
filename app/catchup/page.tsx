import type { Metadata } from 'next';
import { copy } from '@/brand/copy';
import { CatchupHub } from '@/components/catchup/CatchupHub';
import { PostCard } from '@/components/catchup/PostCard';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { Emph } from '@/components/ui/Emph';
import { PageHero } from '@/components/ui/PageHero';
import { CATCHUP_TYPES, getAllPosts } from '@/lib/catchup';
import { toCards } from '@/lib/catchup-cards';
import { renderable } from '@/lib/demo-guard';

export const metadata: Metadata = {
  title: copy.catchup.name,
  description: copy.catchup.lede,
  alternates: { canonical: '/catchup' },
};

export default function CatchupPage() {
  const posts = renderable(getAllPosts(), copy.catchup.name);
  const cards = toCards(posts);
  const featured = cards.find((c) => posts.find((p) => p.slug === c.slug)?.featured) ?? cards[0];
  const rest = cards.filter((c) => c.slug !== featured?.slug);
  return (
    <>
      <PageHero label={copy.catchup.label} title={<Emph text={copy.catchup.title} />} lede={copy.catchup.lede}>
        {posts.some((p) => p.demo) ? <DemoBadge /> : null}
      </PageHero>
      <section className="bg-paper pb-[clamp(72px,9vw,140px)]">
        <div className="wrap">
          {featured ? (
            <div className="mb-16" data-reveal="fade">
              <p className="mono mb-4 text-ink-60">{copy.catchup.featured}</p>
              <PostCard post={featured} size="lg" />
            </div>
          ) : null}
          <CatchupHub posts={rest} types={CATCHUP_TYPES.map((t) => ({ id: t.id, label: t.label }))} />
        </div>
      </section>
    </>
  );
}
