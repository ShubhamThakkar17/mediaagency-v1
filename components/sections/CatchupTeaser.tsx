import { copy } from '@/brand/copy';
import { PostCard, type PostCardData } from '@/components/catchup/PostCard';
import { TLink } from '@/components/providers/Transition';
import { Emph } from '@/components/ui/Emph';
import { ArrowUpRight } from '@/components/ui/Icons';
import { SectionHeading } from '@/components/ui/SectionHeading';

/** Home teaser for Media CatchUp: the latest post of three different types. */
export function CatchupTeaser({ posts }: { posts: PostCardData[] }) {
  if (!posts.length) return null;
  return (
    <section className="section bg-paper" aria-labelledby="catchup-title">
      <div className="wrap">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading label={copy.catchup.label} id="catchup-title" title={<Emph text={copy.catchup.homeTitle} />} lede={copy.catchup.homeLede} />
          <TLink href="/catchup" className="btn btn-outline shrink-0 self-start md:self-end">
            {copy.catchup.cta} <ArrowUpRight size={18} />
          </TLink>
        </div>
        <ul className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
          {posts.map((p, i) => (
            <li key={p.slug} className="w-[84vw] max-w-[380px] shrink-0 snap-center md:w-auto md:max-w-none" data-reveal="fade" style={{ ['--reveal-delay' as string]: `${i * 0.1}s` }}>
              <PostCard post={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
