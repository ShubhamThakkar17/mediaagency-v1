import type { Metadata, Viewport } from 'next';
import { Geist_Mono, Inter, Inter_Tight } from 'next/font/google';
import { brand } from '@/brand/brand.config';
import { resolveTheme, themeCss, themePresets } from '@/brand/theme';
import { Analytics } from '@/components/layout/Analytics';
import { FloatingCta } from '@/components/layout/FloatingCta';
import { Footer } from '@/components/layout/Footer';
import { Nav } from '@/components/layout/Nav';
import { PlannerDrawer } from '@/components/planner/PlannerDrawer';
import { Cursor } from '@/components/providers/Cursor';
import { RevealObserver } from '@/components/providers/RevealObserver';
import { SmoothScroll } from '@/components/providers/SmoothScroll';
import { ThemePreview } from '@/components/providers/ThemePreview';
import { TransitionProvider } from '@/components/providers/Transition';
import { UtmCapture } from '@/components/providers/UtmCapture';
import { JsonLd } from '@/components/ui/JsonLd';
import { getChannelsLite } from '@/lib/channels';
import { DEMO_MODE } from '@/lib/demo-guard';
import { organizationLd } from '@/lib/seo';
import '@/components/glyphs/glyphs.css';
import './globals.css';

const interTight = Inter_Tight({ subsets: ['latin', 'latin-ext'], weight: ['500', '600', '700'], variable: '--font-inter-tight', display: 'swap' });
const inter = Inter({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600'], variable: '--font-inter', display: 'swap' });
const geistMono = Geist_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-geist-mono', display: 'swap' });

const theme = resolveTheme(brand.themePreset);

export const metadata: Metadata = {
  metadataBase: new URL(brand.siteUrl),
  title: { default: `${brand.name} · ${brand.tagline}`, template: `%s · ${brand.name}` },
  description: brand.description,
  applicationName: brand.name,
  openGraph: { type: 'website', siteName: brand.name, title: `${brand.name} · ${brand.tagline}`, description: brand.description, locale: 'en_IN' },
  twitter: { card: 'summary_large_image' },
  // Demo mode keeps the template out of search results (BRIEF §9).
  robots: DEMO_MODE ? { index: false, follow: false } : { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: themePresets[theme].paper, width: 'device-width', initialScale: 1 };

// Runs before first paint: marks JS as available and decides whether the preloader shows.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{var q=new URLSearchParams(location.search);if(sessionStorage.getItem('preloaded')||matchMedia('(prefers-reduced-motion: reduce)').matches||q.has('nopreload')||location.pathname!=='/'){d.classList.add('no-preload')}var t=q.get('theme');if(t){d.dataset.theme=t}}catch(e){d.classList.add('no-preload')}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const channels = getChannelsLite();
  return (
    <html lang="en-IN" data-theme={theme} className={`${interTight.variable} ${inter.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCss(theme) }} />
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <TransitionProvider>
          <SmoothScroll />
          <RevealObserver />
          <ThemePreview />
          <UtmCapture />
          <Nav />
          <main id="main">{children}</main>
          <Footer />
          <FloatingCta />
          <PlannerDrawer channels={channels} />
          <Cursor />
        </TransitionProvider>
        <JsonLd data={organizationLd()} />
        <Analytics />
      </body>
    </html>
  );
}
