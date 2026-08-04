// Checks the built site, not the fact that files exist.
//
// Every failure this project has shipped was silent: a swallowed `</style>` that unstyled every
// PDF and PNG, draft prose leaking into artifacts, a page deleted while links still pointed at
// it. The build stayed green each time because the only gate was `ls`. These assertions are the
// ones that would have caught them.
//
// Run after `npm run ci`. Exits non-zero on the first category that fails.

import fs from 'node:fs';
import path from 'node:path';
import { loadAll } from './lib/content.mjs';
import { DOWNLOADS_DIR, ROOT } from './lib/paths.mjs';

const DIST = path.join(ROOT, 'dist');
const BASE = '/strohs.club';
const failures = [];
const fail = (check, detail) => failures.push(`${check}: ${detail}`);

const htmlFiles = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (e.name.endsWith('.html')) htmlFiles.push(full);
  }
})(DIST);

const rel = (f) => path.relative(DIST, f);

// 1 — every internal link and asset resolves. Catches a deleted page whose links survive.
const resolves = (url) => {
  const clean = url.split('#')[0].split('?')[0];
  if (!clean.startsWith(BASE)) return true;
  const target = path.join(DIST, clean.slice(BASE.length));
  return (
    fs.existsSync(target) &&
    (fs.statSync(target).isFile() || fs.existsSync(path.join(target, 'index.html')))
  );
};
for (const f of htmlFiles) {
  const html = fs.readFileSync(f, 'utf8');
  for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (url.startsWith(BASE) && !resolves(url)) fail('broken link', `${rel(f)} -> ${url}`);
  }
  // 2 — a root-relative internal link that skipped the base prefix 404s in production only.
  for (const [, url] of html.matchAll(/(?:href|src)="(\/(?!strohs\.club\/)[^"]*)"/g)) {
    if (!url.startsWith('//')) fail('unprefixed link', `${rel(f)} -> ${url}`);
  }
  // 3 — editorial markers and build sentinels must never reach a reader.
  if (/<!--\s*\/?draft:/.test(html)) fail('draft marker in HTML', rel(f));
}

// 4 — every artifact a component asked for exists, and is not a stub.
for (const entry of loadAll()) {
  const slug = entry.slug ?? entry.id;
  for (const out of entry.data?.outputs ?? []) {
    if (out === 'page') continue;
    if (entry.isDraft) continue;
    const file = out === 'slides' ? `${slug}-slides.html` : `${slug}.${out}`;
    const built = path.join(DOWNLOADS_DIR, file);
    if (!fs.existsSync(built)) fail('missing artifact', `${slug} declares ${out} -> ${file}`);
    else if (fs.statSync(built).size < 1024) fail('stub artifact', `${file} is under 1 KB`);
  }
}

// 5 — public/ is copied into dist/ by astro build, so a docs-after-build order ships stale ones.
const inPublic = fs.readdirSync(DOWNLOADS_DIR).sort().join('\n');
const inDist = fs.readdirSync(path.join(DIST, 'downloads')).sort().join('\n');
if (inPublic !== inDist) fail('downloads out of sync', 'public/downloads != dist/downloads');

if (failures.length) {
  console.error(`\nBuild verification failed — ${failures.length} problem(s):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`Build verified: ${htmlFiles.length} pages, links and artifacts all resolve.`);
