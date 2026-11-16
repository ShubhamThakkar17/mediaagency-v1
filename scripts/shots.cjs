// QA screenshots: node scripts/shots.cjs <baseUrl> <outDir> [names...]
// Scrolls each page viewport by viewport so scroll-triggered content renders.
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:3210';
const out = process.argv[3] || 'qa/screenshots';
const only = process.argv.slice(4);
const targets = [
  { name: 'home-desktop', path: '/?nopreload', vp: { width: 1440, height: 900 } },
  { name: 'home-mobile', path: '/?nopreload', vp: { width: 375, height: 812 }, mobile: true },
];
(async () => {
  const b = await chromium.launch();
  for (const t of targets.filter((t) => !only.length || only.includes(t.name))) {
    const ctx = await b.newContext({ viewport: t.vp, deviceScaleFactor: 1, isMobile: !!t.mobile, hasTouch: !!t.mobile, reducedMotion: t.reduced ? 'reduce' : 'no-preference' });
    const p = await ctx.newPage();
    const errors = [];
    p.on('requestfailed', (r) => errors.push('FAIL ' + r.url().slice(0, 90)));
    p.on('pageerror', (e) => errors.push(e.message));
    p.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    await p.goto(base + t.path, { waitUntil: 'load', timeout: 60000 });
    await p.waitForTimeout(1500);
    const h = await p.evaluate(() => document.documentElement.scrollHeight);
    let i = 0;
    for (let y = 0; y < h; y += t.vp.height) {
      await p.evaluate((y) => window.scrollTo(0, y), y);
      await p.waitForTimeout(900);
      await p.screenshot({ path: `${out}/${t.name}-${String(i++).padStart(2, '0')}.png` });
      if (i > 40) break;
    }
    console.log(t.name, 'height', h, 'shots', i, 'errors', JSON.stringify(errors.slice(0, 6)));
    await ctx.close();
  }
  await b.close();
})();
