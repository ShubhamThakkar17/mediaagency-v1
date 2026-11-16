import type { ServiceObject } from '@/content/services';

/** CSS gradient stand-in for the 3D objects (no WebGL, before load, or reduced data). */
export function BlobFallback({ kind }: { kind: ServiceObject }) {
  const radius: Record<ServiceObject, string> = {
    torus: '50%',
    capsules: '42% 58% 46% 54% / 60% 40% 60% 40%',
    starburst: '50%',
    blobs: '58% 42% 63% 37% / 41% 55% 45% 59%',
    cube: '28%',
    knot: '46% 54% 38% 62% / 52% 44% 56% 48%',
  };
  return (
    <div className="grid size-full place-items-center" aria-hidden>
      <div
        className="relative aspect-square w-[52%]"
        style={{
          borderRadius: radius[kind],
          background: 'radial-gradient(circle at 32% 28%, color-mix(in srgb, var(--paper) 75%, var(--brand)) 0%, var(--brand) 38%, var(--brand-600) 72%, color-mix(in srgb, var(--brand-600) 70%, var(--ink)) 100%)',
          boxShadow: '0 30px 60px -20px color-mix(in srgb, var(--brand) 60%, transparent)',
        }}
      >
        {kind === 'torus' || kind === 'cube' ? <div className="absolute inset-[32%] rounded-[inherit] bg-cream" /> : null}
      </div>
    </div>
  );
}
