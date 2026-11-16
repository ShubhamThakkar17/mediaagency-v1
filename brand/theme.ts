/**
 * Design tokens. Each preset becomes a block of CSS variables, mapped to
 * Tailwind utilities in app/globals.css. Switch `themePreset` in
 * brand.config.ts (or append ?theme=indigo to any URL to preview) and the
 * whole site reskins, including glyphs and the 3D materials, which read
 * these variables at runtime.
 */
export type ThemeTokens = {
  brand: string;
  brand600: string;
  brand100: string;
  /** Text colour that passes AA on top of `brand` at small sizes. */
  onBrand: string;
  cream: string;
  paper: string;
  mist: string;
  ink: string;
  ink60: string;
  line: string;
};

export const themePresets = {
  saffron: {
    brand: '#FF6036',
    brand600: '#E84E25',
    brand100: '#FFDDD4',
    onBrand: '#151515',
    cream: '#FFF6F3',
    paper: '#FFFFFF',
    mist: '#F7F7F7',
    ink: '#151515',
    ink60: '#626262',
    line: '#E4E4E4',
  },
  indigo: {
    brand: '#4F46E5',
    brand600: '#4036C9',
    brand100: '#DEDCFF',
    onBrand: '#FFFFFF',
    cream: '#F5F5FF',
    paper: '#FFFFFF',
    mist: '#F7F7F9',
    ink: '#14142B',
    ink60: '#5E5E73',
    line: '#E3E3EC',
  },
  forest: {
    brand: '#187A4F',
    brand600: '#126240',
    brand100: '#CFEBDD',
    onBrand: '#FFFFFF',
    cream: '#F3F9F5',
    paper: '#FFFFFF',
    mist: '#F6F7F6',
    ink: '#13201A',
    ink60: '#5B665F',
    line: '#E1E6E3',
  },
} satisfies Record<string, ThemeTokens>;

export type ThemePresetId = keyof typeof themePresets;
export const themePresetIds = Object.keys(themePresets) as ThemePresetId[];

function vars(t: ThemeTokens) {
  return [
    `--brand:${t.brand}`,
    `--brand-600:${t.brand600}`,
    `--brand-100:${t.brand100}`,
    `--on-brand:${t.onBrand}`,
    `--cream:${t.cream}`,
    `--paper:${t.paper}`,
    `--mist:${t.mist}`,
    `--ink:${t.ink}`,
    `--ink-60:${t.ink60}`,
    `--line:${t.line}`,
  ].join(';');
}

/** CSS for every preset. `active` is also applied to :root as the default. */
export function themeCss(active: ThemePresetId) {
  const safe = themePresets[active] ? active : 'saffron';
  const blocks = [`:root{${vars(themePresets[safe])}}`];
  for (const id of themePresetIds) blocks.push(`[data-theme="${id}"]{${vars(themePresets[id])}}`);
  return blocks.join('');
}

export function resolveTheme(id: string | undefined | null): ThemePresetId {
  return id && id in themePresets ? (id as ThemePresetId) : 'saffron';
}
