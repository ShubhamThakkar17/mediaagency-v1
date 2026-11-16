'use client';
import dynamic from 'next/dynamic';

export const AudienceChartLazy = dynamic(() => import('./AudienceChart'), {
  ssr: false,
  loading: () => <div className="h-[340px] w-full animate-pulse rounded-2xl bg-mist" />,
});
