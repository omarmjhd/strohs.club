import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOWNLOADS_DIR, ROOT } from './lib/paths.mjs';
import { contentWarnings, loadAll } from './lib/content.mjs';
import { CANONICAL_LINKS } from '../site/lib/links.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const GENERATED = /\.(pdf|png|html)$/;

// Parse everything first. An unbalanced or mistyped draft marker fails open — the prose it
// should withhold ends up in the artifacts — and an orphaned file produces nothing at all.
// Both used to be a console warning inside a subprocess, which no build could act on.
loadAll();

// Markdown cannot import site/lib/links.mjs, so catch a stale invite here instead of
// publishing a dead one. Rotating the invite means editing links.mjs and the content files
// that quote it; this makes forgetting one a build failure, not a support request.
const linkDrift = [];
for (const dir of ['content', 'slides']) {
  for (const file of fs.readdirSync(path.join(ROOT, dir), { recursive: true })) {
    if (!String(file).endsWith('.md')) continue;
    const full = path.join(ROOT, dir, String(file));
    const body = fs.readFileSync(full, 'utf8');
    for (const m of body.matchAll(/https?:\/\/(?:discord\.gg|instagram\.com)\/[\w.-]+/g)) {
      if (!CANONICAL_LINKS.includes(m[0])) linkDrift.push(`${dir}/${file}: ${m[0]}`);
    }
  }
}
if (linkDrift.length) {
  console.error('\nRefusing to build — links that do not match site/lib/links.mjs:');
  for (const l of linkDrift) console.error(`  - ${l}`);
  process.exit(1);
}

if (contentWarnings.length) {
  console.error(`\nRefusing to build — ${contentWarnings.length} content problem(s):`);
  for (const w of contentWarnings) console.error(`  - ${w}`);
  console.error('\nFix the content, or the artifacts will be wrong in ways nothing else checks.');
  process.exit(1);
}

fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });

const snapshot = new Map(
  fs
    .readdirSync(DOWNLOADS_DIR)
    .filter((f) => GENERATED.test(f))
    .map((f) => [f, fs.statSync(path.join(DOWNLOADS_DIR, f)).mtimeMs])
);

for (const s of ['build-pdf.mjs', 'build-png.mjs', 'build-slides.mjs', 'build-almanac.mjs']) {
  console.log(`\n=== ${s} ===`);
  execFileSync(process.execPath, [path.join(HERE, s)], { stdio: 'inherit' });
}

// Anything untouched by a full run no longer has a component behind it — a renamed
// slug, or a component that stopped asking for that output.
for (const [file, mtime] of snapshot) {
  const full = path.join(DOWNLOADS_DIR, file);
  if (!fs.existsSync(full) || fs.statSync(full).mtimeMs !== mtime) continue;
  fs.rmSync(full);
  console.log('STALE -X', path.relative(ROOT, full));
}

console.log('\nAll docs built → public/downloads/');
