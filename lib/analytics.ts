'use client';
export type AnalyticsEvent = 'planner_mode' | 'planner_result' | 'plan_pdf' | 'plan_share' | 'whatsapp_click' | 'lead_submit';

type W = Window & { gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void };

/** Fires only when GA4 / Meta Pixel ids are configured. Safe no-op otherwise. */
export function track(event: AnalyticsEvent, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === 'undefined') return;
  const w = window as W;
  w.gtag?.('event', event, params);
  w.fbq?.('trackCustom', event, params);
}
