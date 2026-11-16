import { NextResponse, type NextRequest } from 'next/server';
import { brand } from '@/brand/brand.config';
import { leadApiSchema } from '@/lib/lead-schema';

export const runtime = 'nodejs';

// Simple in-memory IP rate limit: 8 submissions per 10 minutes per instance.
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 8;
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > LIMIT;
}

function attribution(req: NextRequest) {
  try {
    const raw = req.cookies.get('m_attr')?.value;
    return raw ? (JSON.parse(decodeURIComponent(raw)) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

/**
 * POST /api/lead (BRIEF §10.3). Validates with zod, drops honeypot hits,
 * rate-limits by IP, then forwards to a Google Sheets webhook and/or Resend
 * when configured. With no env vars it logs the lead and returns success.
 */
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'local';
  if (limited(ip)) return NextResponse.json({ ok: false, error: 'Too many requests. Please try again shortly.' }, { status: 429 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }
  const parsed = leadApiSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Validation failed', issues: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })) }, { status: 422 });
  }
  const lead = parsed.data;
  // Honeypot: pretend success so bots learn nothing.
  if (lead.website) return NextResponse.json({ ok: true });

  const record = {
    ...lead,
    receivedAt: new Date().toISOString(),
    attribution: attribution(req),
    referer: req.headers.get('referer') ?? '',
    userAgent: req.headers.get('user-agent')?.slice(0, 200) ?? '',
  };
  const delivered: string[] = [];

  const sheets = process.env.SHEETS_WEBHOOK_URL;
  if (sheets) {
    try {
      const r = await fetch(sheets, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ secret: process.env.SHEETS_WEBHOOK_SECRET ?? '', lead: record }),
        signal: AbortSignal.timeout(8000),
      });
      if (r.ok) delivered.push('sheets');
    } catch (e) {
      console.error('[lead] sheets webhook failed', e);
    }
  }

  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_EMAIL_TO;
  if (resendKey && to) {
    try {
      const lines = Object.entries(record)
        .filter(([k]) => k !== 'website')
        .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : String(v)}`)
        .join('\n');
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { authorization: `Bearer ${resendKey}`, 'content-type': 'application/json' },
        body: JSON.stringify({
          from: process.env.LEAD_EMAIL_FROM || `${brand.name} <onboarding@resend.dev>`,
          to: to.split(',').map((s) => s.trim()),
          subject: `New ${lead.kind} lead: ${'name' in lead && lead.name ? lead.name : lead.email}`,
          text: lines,
        }),
        signal: AbortSignal.timeout(8000),
      });
      if (r.ok) delivered.push('email');
    } catch (e) {
      console.error('[lead] resend failed', e);
    }
  }

  if (!delivered.length) console.info('[lead] received (no integrations configured)', JSON.stringify(record));
  return NextResponse.json({ ok: true, delivered });
}
