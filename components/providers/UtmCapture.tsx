'use client';
import { useEffect } from 'react';

export const ATTRIBUTION_COOKIE = 'm_attr';

/** Stores UTM params, referrer and landing page in a first-party cookie (first touch, 90 days). */
export function UtmCapture() {
  useEffect(() => {
    if (document.cookie.includes(`${ATTRIBUTION_COOKIE}=`)) return;
    const q = new URLSearchParams(window.location.search);
    const data: Record<string, string> = { landing: window.location.pathname.slice(0, 200), referrer: document.referrer.slice(0, 300) };
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid']) {
      const v = q.get(k);
      if (v) data[k] = v.slice(0, 120);
    }
    document.cookie = `${ATTRIBUTION_COOKIE}=${encodeURIComponent(JSON.stringify(data))}; path=/; max-age=${60 * 60 * 24 * 90}; samesite=lax`;
  }, []);
  return null;
}
