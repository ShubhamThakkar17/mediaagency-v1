// Full-page QA screenshots of inner pages: node scripts/shots-pages.cjs <base> <outDir> [names...]
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:3210';
const out = process.argv[3] || 'qa/screenshots';
const only = process.argv.slice(4);
const W = { width: 1440, height: 900 };
const M = { width: 375, height: 812 };
const T = [
  { name: 'channel-page-desktop', path: '/channels/hoardings', vp: W },
  { name: 'channel-page-mobile', path: '/channels/metro-wraps', vp: M, mobile: true },
  { name: 'channels-index', path: '/channels', vp: W },
  { name: 'planner-budget', path: '/planner?mode=budget&industry=real-estate&objective=launch&stage=new&budget=4000000&months=3', vp: W },
  { name: 'planner-channels', path: '/planner?mode=channels&channels=metro-wraps,airport,social-media&industry=bfsi', vp: W },
  { name: 'planner-mobile', path: '/planner', vp: M, mobile: true },
  { name: 'services', path: '/services', vp: W },
  { name: 'work', path: '/work', vp: W },
  { name: 'about', path: '/about', vp: W },
  { name: 'contact', path: '/contact', vp: W },
  { name: 'methodology', path: '/planner-methodology', vp: W },
  { name: 'insight', path: '/insights/split-25-lakh-launch-budget', vp: W },
  { name: '404', path: '/nope', vp: W },
  { name: 'theme-indigo', path: '/?nopreload&theme=indigo', vp: W, viewportOnly: true },
  { name: 'theme-forest', path: '/?nopreload&theme=forest', vp: W, viewportOnly: true },
];
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const t of T.filter((t) => !only.length || only.includes(t.name))) {
    const ctx = await b.newContext({ viewport: t.vp, deviceScaleFactor: 1, isMobile: !!t.mobile, hasTouch: !!t.mobile });
    const p = await ctx.newPage();
    const errors = [];
    p.on('pageerror', (e) => errors.push(e.message.slice(0, 160)));
    p.on('console', (m) => m.type() === 'error' && !m.text().includes('404') && errors.push(m.text().slice(0, 160)));
    await p.goto(base + t.path, { waitUntil: 'load', timeout: 60000 });
    await p.waitForTimeout(1800);
    if (!t.viewportOnly) {
      const h = await p.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < h; y += t.vp.height * 0.8) {
        await p.evaluate((y) => window.scrollTo(0, y), y);
        await p.waitForTimeout(250);
      }
      await p.evaluate(() => window.scrollTo(0, 0));
      await p.waitForTimeout(1200);
    }
    await p.screenshot({ path: `${out}/${t.name}.png`, fullPage: !t.viewportOnly });
    console.log(t.name, errors.length ? JSON.stringify(errors.slice(0, 4)) : 'ok');
    await ctx.close();
  }
  await b.close();
})();
