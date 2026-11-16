/**
 * Demo-content guard (BRIEF §9).
 *
 * NEXT_PUBLIC_DEMO_MODE defaults to "true": demo items render and carry a
 * "Template preview · sample content" badge, and the site is noindexed.
 * Set it to "false" for a real launch: the badge disappears and the build
 * FAILS if any item flagged `demo: true` is still being rendered, so fake
 * proof can never ship by accident.
 */
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';

export type DemoFlagged = { demo?: boolean };

export class DemoContentError extends Error {}

/** Wrap any demo-capable data at the point it is rendered. */
export function renderable<T extends DemoFlagged>(items: T[], label: string): T[] {
  if (!DEMO_MODE) {
    const offenders = items.filter((i) => i.demo === true);
    if (offenders.length > 0) {
      throw new DemoContentError(
        `[demo-guard] NEXT_PUBLIC_DEMO_MODE is "false" but ${offenders.length} demo item(s) are still rendered in "${label}". ` +
          `Replace them in content/demo.ts (set demo: false on real content) or remove the section.`,
      );
    }
  }
  return items;
}

export function renderableOne<T extends DemoFlagged>(item: T, label: string): T {
  return renderable([item], label)[0];
}

/** Sourced figures flagged verified:false are hidden once demo mode is off. */
export function visibleFigures<T extends { verified: boolean }>(items: T[]): T[] {
  return DEMO_MODE ? items : items.filter((i) => i.verified);
}
