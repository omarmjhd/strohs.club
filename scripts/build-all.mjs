import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOWNLOADS_DIR, ROOT } from './lib/paths.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const GENERATED = /\.(pdf|png|html)$/;

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
