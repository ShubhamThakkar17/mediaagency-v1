/** Accessible accordion on native <details>. FAQPage JSON-LD is emitted by the page. */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((f) => (
        <details key={f.q} className="group py-2">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-left [&::-webkit-details-marker]:hidden">
            <span className="display text-[1.2rem] font-semibold leading-snug sm:text-[1.35rem]">{f.q}</span>
            <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line transition-[transform,background-color] duration-300 group-open:rotate-45 group-open:border-brand group-open:bg-brand group-open:text-on-brand" aria-hidden>
              +
            </span>
          </summary>
          <p className="max-w-[70ch] pb-5 pr-14 text-[15.5px] leading-relaxed text-ink-60">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
