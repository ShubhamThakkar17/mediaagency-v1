import { expect, test, type Page } from '@playwright/test';

const ringAngle = (page: Page) =>
  page.getByTestId('cylinder-ring').evaluate((el) => {
    const m = /rotateY\((-?[\d.]+)deg\)/.exec((el as HTMLElement).style.transform);
    return m ? parseFloat(m[1]) : NaN;
  });

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  return errors;
}

test('home renders and the cylinder responds to drag', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?nopreload');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Every screen');
  const cyl = page.getByTestId('cylinder');
  await expect(cyl).toBeVisible();
  const before = await ringAngle(page);
  const box = (await cyl.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 320, box.y + box.height / 2, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(300);
  const after = await ringAngle(page);
  expect(Math.abs(after - before)).toBeGreaterThan(20);
  // Keyboard: arrow keys rotate one card (20°).
  await cyl.focus();
  const k0 = await ringAngle(page);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(900);
  expect(Math.abs((await ringAngle(page)) - k0)).toBeGreaterThan(12);
  expect(errors).toEqual([]);
});

test('reduced-motion home renders without errors and uses the flat carousel', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const errors = collectErrors(page);
  await page.goto('/');
  await expect(page.locator('#preloader')).toBeHidden();
  await expect(page.locator('.cyl-flat')).toBeVisible();
  await expect(page.locator('.cyl-3d')).toBeHidden();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.locator('footer')).toBeVisible();
  expect(errors).toEqual([]);
  await ctx.close();
});

test('a channel page renders with costs disclaimer and FAQs', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/channels/hoardings');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Hoardings');
  await expect(page.getByText('Indicative ranges for planning.', { exact: false })).toBeVisible();
  await expect(page.locator('details summary').first()).toBeVisible();
  await expect(page.getByTestId('channel-cta')).toHaveAttribute('href', '/planner?mode=budget&include=hoardings');
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(ld.join('')).toContain('FAQPage');
  expect(errors).toEqual([]);
});

test('planner: budget mode, channels mode and share URL restore', async ({ page }) => {
  await page.goto('/planner?mode=budget&industry=real-estate&objective=leads&budget=4000000&months=3&include=airport');
  await expect(page.getByTestId('budget-results')).toBeVisible();
  expect(await page.getByTestId('mix-line').count()).toBeGreaterThan(1);
  await expect(page.getByTestId('mix-line').filter({ hasText: 'Airport' })).toHaveCount(1);

  await page.getByRole('radio', { name: 'I know my channels' }).click();
  await expect(page.getByTestId('channels-results')).toBeVisible();
  await expect(page.getByTestId('scenario')).toHaveCount(3);
  await expect(page).toHaveURL(/mode=channels/);

  const url = page.url();
  await page.goto(url);
  await expect(page.getByTestId('channels-results')).toBeVisible();
  await expect(page.getByRole('radio', { name: 'I know my channels' })).toHaveAttribute('aria-checked', 'true');
});

test('planner: PDF downloads and WhatsApp share opens', async ({ page, context }) => {
  await page.goto('/planner?mode=budget&budget=2500000');
  await expect(page.getByTestId('budget-results')).toBeVisible();
  const [download] = await Promise.all([page.waitForEvent('download', { timeout: 30_000 }), page.getByTestId('download-pdf').click()]);
  expect(download.suggestedFilename()).toMatch(/\.pdf$/);
  // Stub WhatsApp so the test never leaves the machine; assert the link we build.
  await context.route(/wa\.me|whatsapp\.com/, (route) => route.fulfill({ status: 200, contentType: 'text/html', body: 'ok' }));
  const [popup] = await Promise.all([context.waitForEvent('page'), page.getByTestId('whatsapp').click()]);
  expect(popup.url()).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
  expect(decodeURIComponent(popup.url())).toContain('Indicative estimate');
});

test('lead API returns success with no env vars', async ({ request }) => {
  const res = await request.post('/api/lead', {
    data: { kind: 'plan', name: 'Test Person', phone: '+91 98765 43210', email: 'test@example.com', company: 'Example', city: 'Pune', message: 'Hello' },
  });
  expect(res.status()).toBe(200);
  expect((await res.json()).ok).toBe(true);
  const bad = await request.post('/api/lead', { data: { kind: 'plan', name: 'x', email: 'nope' } });
  expect(bad.status()).toBe(422);
});

test('SmartMedia shows the branded fallback when an image URL is dead', async ({ page }) => {
  await page.route(/images\.unsplash\.com/, (route) => route.fulfill({ status: 404, body: '' }));
  await page.goto('/channels/print');
  await expect(page.locator('[data-media-fallback]').first()).toBeVisible();
  const broken = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.getBoundingClientRect().width > 0).length);
  expect(broken).toBe(0);
});

test('theme preset reskins the brand colour', async ({ page }) => {
  await page.goto('/?nopreload&theme=indigo');
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--brand').trim().toUpperCase())).toBe('#4F46E5');
});
