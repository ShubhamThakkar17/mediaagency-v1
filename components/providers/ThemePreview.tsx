'use client';
import { useEffect } from 'react';
import { themePresetIds } from '@/brand/theme';

/** Append ?theme=indigo (or forest, saffron) to any URL to preview a preset. */
export function ThemePreview() {
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('theme');
    if (t && (themePresetIds as string[]).includes(t)) {
      document.documentElement.dataset.theme = t;
      window.dispatchEvent(new Event('themechange'));
    }
  }, []);
  return null;
}
