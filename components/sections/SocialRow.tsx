import { brand } from '@/brand/brand.config';
import { copy } from '@/brand/copy';
import { ArrowUpRight, SocialIcon } from '@/components/ui/Icons';

/** Four equal cells that fill with the brand colour from the bottom on hover (BRIEF §2 row 13). */
export function SocialRow() {
  return (
    <section aria-label={copy.social.label} className="border-t border-line bg-paper">
      <ul className="grid grid-cols-2 lg:grid-cols-4">
        {brand.socials.map((s, i) => (
          <li key={s.id} className={`border-line ${i % 2 === 0 ? 'border-r' : ''} ${i < 2 ? 'border-b lg:border-b-0' : ''} lg:border-r lg:last:border-r-0`}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex h-[120px] items-center justify-between overflow-hidden px-6 sm:h-[160px] sm:px-10"
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-brand transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100 motion-reduce:transition-none" aria-hidden />
              <span className="relative flex items-center gap-3 text-lg font-medium transition-colors group-hover:text-on-brand sm:text-2xl">
                <SocialIcon id={s.id} size={24} />
                {s.label}
              </span>
              <ArrowUpRight size={22} className="relative transition-transform duration-500 group-hover:rotate-45 group-hover:text-on-brand" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
