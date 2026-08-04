import fs from 'node:fs';
import path from 'node:path';
import { CANONICAL_LINKS } from '../../site/lib/links.mjs';
import { ROOT } from './paths.mjs';

// Markdown cannot import site/lib/links.mjs, so content files write the literal URL. Any URL
// on a watched host that is not the canonical one is a dead invite waiting to be published.
const WATCHED = /https?:\/\/(?:discord\.gg|instagram\.com)\/[\w.-]+/g;

export function findLinkDrift(dirs = ['content', 'slides']) {
  const drift = [];
  for (const dir of dirs) {
    for (const name of fs.readdirSync(path.join(ROOT, dir), { recursive: true })) {
      const rel = String(name);
      if (!rel.endsWith('.md')) continue;
      const full = path.join(ROOT, dir, rel);
      fs.readFileSync(full, 'utf8')
        .split('\n')
        .forEach((text, i) => {
          for (const [url] of text.matchAll(WATCHED)) {
            if (!CANONICAL_LINKS.includes(url)) {
              drift.push({ file: `${dir}/${rel}`, line: i + 1, url });
            }
          }
        });
    }
  }
  return drift;
}
