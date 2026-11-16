'use client';
import { useEffect, useRef, useState } from 'react';
import { Glyph, type AnyGlyphId } from '@/components/glyphs/Glyph';
import { cn } from '@/lib/cn';
import { useInView } from '@/lib/hooks';
import { sizedSrc, srcSet } from '@/lib/media-url';
import type { MediaRef } from '@/lib/types';

type Props = {
  media: MediaRef;
  /** Optional looping video shown over the image when allowed. */
  video?: MediaRef;
  /** Glyph drawn on the branded fallback. */
  glyph?: AnyGlyphId;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  duotone?: boolean;
  kenBurns?: boolean;
  /** Largest width to request from the CDN. */
  maxWidth?: number;
};

/**
 * Every image and video on the site goes through this component (BRIEF §8.5).
 * A missing or dead URL never shows a broken image: it renders a branded
 * animated gradient mesh with the channel glyph instead.
 */
export function SmartMedia({ media, video, glyph, className, imgClassName, sizes = '100vw', priority, duotone, kenBurns, maxWidth = 2000 }: Props) {
  const [failed, setFailed] = useState(!media.src);
  const [playVideo, setPlayVideo] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const near = useInView(wrap, '300px');

  useEffect(() => setFailed(!media.src), [media.src]);

  // Catch images that failed before hydration attached onError.
  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0 && media.src) setFailed(true);
  }, [media.src]);

  useEffect(() => {
    if (!video?.src || !near) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const saveData = conn?.saveData || /2g/.test(conn?.effectiveType ?? '');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setPlayVideo(!saveData && !reduced);
  }, [video?.src, near]);

  if (failed) {
    return (
      <div ref={wrap} className={cn('mesh relative overflow-hidden', className)} role="img" aria-label={media.alt} data-media-fallback>
        {glyph ? (
          <div className="absolute inset-0 grid place-items-center p-[14%]">
            <div className="aspect-square h-full max-h-[320px] max-w-full opacity-95">
              <Glyph id={glyph} tone="brand" />
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div ref={wrap} className={cn('relative overflow-hidden bg-cream', duotone && 'duotone', className)}>
      <img
        ref={img}
        src={sizedSrc(media.src, Math.min(1200, maxWidth))}
        srcSet={srcSet(media.src, maxWidth)}
        sizes={sizes}
        alt={media.alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        onError={() => setFailed(true)}
        className={cn('absolute inset-0 size-full object-cover', kenBurns && 'kenburns', imgClassName)}
      />
      {video?.src && playVideo ? (
        <video
          className="absolute inset-0 size-full object-cover"
          src={video.src}
          poster={sizedSrc(media.src, 1200)}
          muted
          playsInline
          loop
          autoPlay
          preload="metadata"
          aria-hidden
          onError={() => setPlayVideo(false)}
        />
      ) : null}
    </div>
  );
}
