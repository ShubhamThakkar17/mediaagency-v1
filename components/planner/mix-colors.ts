/** Mix shades derived from the brand tokens, so presets reskin the chart. */
export const MIX_COLORS = [
  'var(--brand)',
  'var(--ink)',
  'color-mix(in srgb, var(--brand) 55%, var(--paper))',
  'color-mix(in srgb, var(--ink) 55%, var(--paper))',
  'var(--brand-600)',
  'color-mix(in srgb, var(--brand) 30%, var(--ink))',
  'var(--brand-100)',
  'color-mix(in srgb, var(--ink) 25%, var(--paper))',
  'color-mix(in srgb, var(--brand) 75%, var(--ink))',
];
