import { ImageResponse } from 'next/og';
import { brand } from '@/brand/brand.config';
import { resolveTheme, themePresets } from '@/brand/theme';

export const OG_SIZE = { width: 1200, height: 630 };

/** Cream background, brand pill, big title (BRIEF §12). */
export function ogImage({ label, title, sub }: { label: string; title: string; sub?: string }) {
  const t = themePresets[resolveTheme(brand.themePreset)];
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: t.cream, padding: 72, fontFamily: 'sans-serif', position: 'relative' }}>
        <div style={{ position: 'absolute', right: -120, bottom: -160, width: 560, height: 560, borderRadius: 9999, background: t.brand, opacity: 0.35, filter: 'blur(80px)' }} />
        <div style={{ display: 'flex', fontSize: 38, fontWeight: 700, color: t.ink, letterSpacing: -1.5 }}>
          {brand.logo.base}
          <span style={{ color: t.brand }}>{brand.logo.accent}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignSelf: 'flex-start', background: t.brand, color: t.onBrand, borderRadius: 999, padding: '10px 22px', fontSize: 22, letterSpacing: 3, textTransform: 'uppercase' }}>{label}</div>
          <div style={{ fontSize: 92, fontWeight: 700, color: t.ink, letterSpacing: -4, lineHeight: 1, marginTop: 28, maxWidth: 1000 }}>{title}</div>
          {sub ? <div style={{ fontSize: 30, color: t.ink60, marginTop: 22, maxWidth: 900 }}>{sub}</div> : null}
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
