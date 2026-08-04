// Visual assertions, not pixel snapshots.
//
// The worst bug this project shipped produced perfectly valid HTML with no colour: a swallowed
// `</style>` dropped every brand variable, so the social PNGs lost their navy band and rendered
// the competition's own name in white on white. Structure checks cannot see that, and pixel
// baselines would fail on macOS-vs-Linux font rendering long before they caught it.
//
// So these assert properties instead: text must be visible against what is behind it, the
// custom properties a page relies on must resolve, nothing may overflow the viewport, and a
// share image must actually carry ink. No baselines, no cross-platform drift.
//
// Usage: node scripts/verify-visual.mjs   (after `npm run ci`)

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import { CHROME, DOWNLOADS_DIR, ROOT } from './lib/paths.mjs';
import { loadCompetitions } from './lib/content.mjs';
import { onePagerHTML } from '../templates/one-pager.mjs';
import { socialHTML } from '../templates/social.mjs';

const PORT = 4599;
const BASE = '/strohs.club';
const MIN_CONTRAST = 1.6; // an invisibility check, not a WCAG audit
const MIN_INK = 0.08; // a share image that is 92%+ blank is broken

const failures = [];
const fail = (check, detail) => failures.push(`${check}: ${detail}`);

// Browser-side checks are passed to page.evaluate as functions, so there is no string escaping
// to get wrong — an earlier version of this file lost its regex backslashes to exactly that.

function findInvisibleText(minContrast) {
  const parse = (c) => {
    const m = (c || '').match(/[\d.]+/g);
    return m ? m.slice(0, 4).map(Number) : null;
  };
  const lum = ([r, g, b]) => {
    const f = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const contrast = (a, b) => {
    const [hi, lo] = [lum(a), lum(b)].sort((p, q) => q - p);
    return (hi + 0.05) / (lo + 0.05);
  };
  const backdrop = (el) => {
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
      const c = parse(getComputedStyle(n).backgroundColor);
      if (c && (c[3] === undefined || c[3] > 0.1)) return c;
    }
    return [255, 255, 255];
  };

  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    const text = [...el.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent.trim())
      .join(' ')
      .trim();
    if (!text) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) < 0.1) continue;
    const box = el.getBoundingClientRect();
    if (box.width < 2 || box.height < 2) continue;
    const fg = parse(cs.color);
    if (!fg) continue;
    const ratio = contrast(fg, backdrop(el));
    if (ratio < minContrast) {
      out.push({
        tag: el.tagName.toLowerCase(),
        text: text.slice(0, 48),
        ratio: Math.round(ratio * 100) / 100,
      });
    }
  }
  return out;
}

// Only the properties this page actually references — a fixed list would flag a token some
// stylesheet legitimately never uses.
function findUnresolvedTokens() {
  const used = new Set();
  for (const sheet of document.styleSheets) {
    let rules;
    try {
      rules = sheet.cssRules;
    } catch {
      continue;
    }
    for (const rule of rules) {
      for (const m of (rule.cssText || '').matchAll(/var\((--[\w-]+)/g)) used.add(m[1]);
    }
  }
  const cs = getComputedStyle(document.documentElement);
  return [...used].filter((n) => !cs.getPropertyValue(n).trim());
}

function measureOverflow() {
  const doc = document.documentElement;
  const wide = [...document.querySelectorAll('body *')]
    .filter((el) => el.getBoundingClientRect().right > doc.clientWidth + 2)
    .slice(0, 4)
    .map((el) => el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : ''));
  return { scrollW: doc.scrollWidth, clientW: doc.clientWidth, wide };
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox'],
});

async function withPage(viewport, fn) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  try {
    return await fn(page);
  } finally {
    await page.close();
  }
}

// --- 1: the print templates, rendered exactly as the pipeline renders them ------------------
const badge = `data:image/png;base64,${fs
  .readFileSync(path.join(ROOT, 'public/brand/strohs-badge.png'))
  .toString('base64')}`;

for (const entry of loadCompetitions().slice(0, 3)) {
  for (const [name, html] of [
    ['one-pager', onePagerHTML({ data: entry.data, bodyHtml: entry.bodyHtml, badge, hero: null })],
    ['social', socialHTML({ data: entry.data, badge })],
  ]) {
    await withPage({ width: 1080, height: 1350 }, async (page) => {
      await page.setContent(html, { waitUntil: 'networkidle0' });
      for (const t of await page.evaluate(findUnresolvedTokens)) {
        fail('brand token unresolved', `${name}/${entry.slug}: ${t}`);
      }
      for (const t of await page.evaluate(findInvisibleText, MIN_CONTRAST)) {
        fail('invisible text', `${name}/${entry.slug}: <${t.tag}> "${t.text}" contrast ${t.ratio}`);
      }
    });
  }
}

// --- 2: the built site, at phone and desktop widths -----------------------------------------
const preview = spawn(
  process.execPath,
  [path.join(ROOT, 'node_modules/.bin/astro'), 'preview', '--port', String(PORT)],
  { cwd: ROOT, stdio: 'ignore' }
);
const ready = async () => {
  for (let i = 0; i < 90; i++) {
    try {
      if ((await fetch(`http://localhost:${PORT}${BASE}/`)).ok) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 400));
  }
  return false;
};

try {
  if (!(await ready())) {
    fail('preview', `server did not start on ${PORT} — run \`npm run build\` first`);
  } else {
    const routes = fs
      .readdirSync(path.join(ROOT, 'dist'), { recursive: true })
      .filter((f) => String(f).endsWith('index.html'))
      .map((f) => '/' + String(f).replace(/index\.html$/, ''));

    for (const route of routes) {
      for (const vp of [
        { label: 'phone', width: 390, height: 844, isMobile: true },
        { label: 'desktop', width: 1280, height: 900 },
      ]) {
        await withPage(vp, async (page) => {
          await page.goto(`http://localhost:${PORT}${BASE}${route}`, { waitUntil: 'networkidle0' });
          const o = await page.evaluate(measureOverflow);
          if (o.scrollW > o.clientW + 2) {
            const culprits = o.wide.length ? ` — ${o.wide.join(', ')}` : '';
            fail(
              'horizontal overflow',
              `${route} at ${vp.label}: ${o.scrollW}px in ${o.clientW}px${culprits}`
            );
          }
          if (vp.label !== 'desktop') return;
          for (const t of await page.evaluate(findUnresolvedTokens)) {
            fail('brand token unresolved', `${route}: ${t}`);
          }
          for (const t of await page.evaluate(findInvisibleText, MIN_CONTRAST)) {
            fail('invisible text', `${route}: <${t.tag}> "${t.text}" contrast ${t.ratio}`);
          }
        });
      }
    }
  }
} finally {
  preview.kill('SIGTERM');
  await browser.close();
}

// --- 3: generated share images must actually carry ink --------------------------------------
for (const entry of loadCompetitions()) {
  if (entry.isDraft || !(entry.data.outputs ?? []).includes('png')) continue;
  const file = path.join(DOWNLOADS_DIR, `${entry.slug}.png`);
  if (!fs.existsSync(file)) continue; // verify-build.mjs owns missing artifacts
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  let inked = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    if (data[i] < 245 || data[i + 1] < 245 || data[i + 2] < 245) inked++;
  }
  const ratio = inked / (info.width * info.height);
  if (ratio < MIN_INK) {
    fail('share image blank', `${entry.slug}.png is ${(100 - ratio * 100).toFixed(1)}% white`);
  }
}

if (failures.length) {
  console.error(`\nVisual verification failed — ${failures.length} problem(s):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log('Visual checks passed: text is visible, tokens resolve, nothing overflows, images have ink.');
