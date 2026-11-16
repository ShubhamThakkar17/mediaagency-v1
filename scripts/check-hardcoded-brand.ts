/**
 * Fails (exit 1) if the brand name appears in code outside /brand, /content
 * or /data (BRIEF §12). Components must read brand strings from config.
 * Usage: pnpm check:brand        (checks the name in brand/brand.config.ts)
 *        pnpm check:brand Foo    (checks an extra literal too)
 */
import fs from 'node:fs';
import path from 'node:path';
import { brand } from '../brand/brand.config';

const ROOT = path.resolve(import.meta.dirname, '..');
const ALLOWED = ['brand', 'content', 'data'];
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'qa', 'test-results', 'playwright-report', '.vercel', 'integrations']);
const EXT = /\.(ts|tsx|js|jsx|mjs|cjs|css)$/;
const needles = [brand.name, ...process.argv.slice(2)].filter(Boolean);

const hits: string[] = [];
function walk(dir: string) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(ROOT, full);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      if (ALLOWED.includes(rel)) continue;
      walk(full);
    } else if (EXT.test(entry.name) && rel !== path.join('scripts', 'check-hardcoded-brand.ts')) {
      const lines = fs.readFileSync(full, 'utf8').split('\n');
      lines.forEach((line, i) => {
        for (const n of needles) if (line.toLowerCase().includes(n.toLowerCase())) hits.push(`${rel}:${i + 1}: ${line.trim().slice(0, 120)}`);
      });
    }
  }
}
walk(ROOT);

if (hits.length) {
  console.error(`✗ Hard-coded brand string found outside ${ALLOWED.map((a) => `/${a}`).join(', ')}:\n${hits.join('\n')}`);
  process.exit(1);
}
console.log(`✓ No hard-coded "${needles.join('", "')}" outside ${ALLOWED.map((a) => `/${a}`).join(', ')}.`);
