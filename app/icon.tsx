import { ImageResponse } from 'next/og';
import { brand } from '@/brand/brand.config';
import { resolveTheme, themePresets } from '@/brand/theme';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

/** Favicon from brand config: the accent part of the logo on the brand colour. */
export default function Icon() {
  const t = themePresets[resolveTheme(brand.themePreset)];
  const mark = brand.logo.accent.slice(0, 3);
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.brand, borderRadius: 16, color: t.ink, fontSize: mark.length > 2 ? 26 : 34, fontWeight: 700, letterSpacing: -1.5 }}>
        {mark}
      </div>
    ),
    size,
  );
}
