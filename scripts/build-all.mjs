import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));

for (const s of ['build-pdf.mjs', 'build-png.mjs', 'build-slides.mjs']) {
  console.log(`\n=== ${s} ===`);
  execFileSync(process.execPath, [path.join(HERE, s)], { stdio: 'inherit' });
}
console.log('\nAll docs built → public/downloads/');
