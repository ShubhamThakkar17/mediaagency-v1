'use client';
import { useState } from 'react';
import { brand } from '@/brand/brand.config';
import { ArrowUpRight, WhatsAppIcon } from '@/components/ui/Icons';
import { track } from '@/lib/analytics';
import { planSummaryText, type PlanResult } from '@/lib/planner';
import type { ChannelLite } from '@/lib/types';
import { LeadModal } from './LeadModal';

export function PlannerActions({ result, shareQuery, channels }: { result: PlanResult; shareQuery: () => string; channels: ChannelLite[] }) {
  const [copied, setCopied] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [lead, setLead] = useState(false);
  const shareUrl = () => `${window.location.origin}/planner?${shareQuery()}`;

  const copyLink = async () => {
    const url = shareUrl();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    track('plan_share', { mode: result.mode });
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const downloadPdf = async () => {
    setPdfBusy(true);
    try {
      const { downloadPlanPdf } = await import('./pdf');
      await downloadPlanPdf(result, channels, shareUrl());
      track('plan_pdf', { mode: result.mode });
    } finally {
      setPdfBusy(false);
    }
  };

  const whatsapp = () => {
    track('whatsapp_click', { from: 'planner' });
    const text = planSummaryText(result, { brandName: brand.name, url: shareUrl() });
    window.open(`https://wa.me/${brand.contact.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <button type="button" onClick={copyLink} className="btn btn-sm btn-outline bg-paper" data-testid="copy-link">
          <span aria-live="polite">{copied ? 'Link copied' : 'Copy share link'}</span>
        </button>
        <button type="button" onClick={downloadPdf} disabled={pdfBusy} className="btn btn-sm btn-outline bg-paper disabled:opacity-60" data-testid="download-pdf">
          {pdfBusy ? 'Preparing…' : 'Download PDF'}
        </button>
        <button type="button" onClick={whatsapp} className="btn btn-sm btn-outline col-span-2 bg-paper sm:col-span-1" data-testid="whatsapp">
          <WhatsAppIcon size={16} /> WhatsApp
        </button>
      </div>
      <button type="button" onClick={() => setLead(true)} className="btn btn-brand w-full">
        Get a detailed plan from our team <ArrowUpRight size={18} />
      </button>
      <LeadModal open={lead} onClose={() => setLead(false)} context={{ planner: shareQuery() }} />
    </div>
  );
}
