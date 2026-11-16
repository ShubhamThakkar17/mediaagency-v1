import { afterEach, describe, expect, it, vi } from 'vitest';

describe('demo guard', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('renders demo items while demo mode is on (default)', async () => {
    const { renderable, DEMO_MODE } = await import('@/lib/demo-guard');
    expect(DEMO_MODE).toBe(true);
    expect(renderable([{ demo: true }], 'test')).toHaveLength(1);
  });

  it('throws on any demo item once demo mode is off', async () => {
    vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', 'false');
    const { renderable, DemoContentError } = await import('@/lib/demo-guard');
    expect(() => renderable([{ demo: false }, { demo: true }], 'test')).toThrow(DemoContentError);
    expect(renderable([{ demo: false }], 'test')).toHaveLength(1);
  });

  it('hides unverified market figures once demo mode is off', async () => {
    vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', 'false');
    const { visibleFigures } = await import('@/lib/demo-guard');
    expect(visibleFigures([{ verified: true }, { verified: false }])).toHaveLength(1);
  });
});
