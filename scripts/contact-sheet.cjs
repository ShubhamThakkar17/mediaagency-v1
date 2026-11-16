// node scripts/contact-sheet.cjs <outPng> <cols> <img...> : tiles screenshots into one image for review.
const { chromium } = require('playwright');
const path = require('path');
const [out, cols, ...imgs] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1800, height: 800 } });
  const html = `<body style="margin:0;background:#888;display:grid;grid-template-columns:repeat(${cols},1fr);gap:6px">${imgs.map((i) => `<div style="position:relative"><img src="data:image/png;base64,${require("fs").readFileSync(i).toString("base64")}" style="width:100%;display:block"><span style="position:absolute;top:4px;left:4px;background:#000;color:#fff;font:14px sans-serif;padding:2px 6px">${path.basename(i)}</span></div>`).join('')}</body>`;
  await p.setContent(html, { waitUntil: 'load' });
  await p.screenshot({ path: out, fullPage: true });
  await b.close();
})();
