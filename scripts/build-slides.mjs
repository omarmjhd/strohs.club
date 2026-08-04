import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { loadCompetitions } from './lib/content.mjs';
import { BUILD_DIR, CHROME, DOWNLOADS_DIR, ROOT, SLIDES_DIR } from './lib/paths.mjs';

const DECK = 'onboarding';
const COMPETITIONS_TOKEN = /<!--\s*@competitions\s*-->/;
const FRONTMATTER = /^(---\r?\n[\s\S]*?\r?\n---\r?\n)/;

fs.mkdirSync(BUILD_DIR, { recursive: true });
fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
const marpBin = path.join(ROOT, 'node_modules/.bin/marp');

function competitionSlide(data) {
  const bullets = (data.keyFacts || [])
    .slice(0, 4)
    .map((f) => `- **${f.label}:** ${f.value}`)
    .join('\n');
  return `## ${data.title}\n\n${data.tagline || ''}\n\n${bullets}`;
}

const source = fs.readFileSync(path.join(SLIDES_DIR, `${DECK}.md`), 'utf8');
const theme = fs.readFileSync(path.join(SLIDES_DIR, 'theme.css'), 'utf8');

if (!COMPETITIONS_TOKEN.test(source)) {
  throw new Error(`${DECK}.md is missing the <!-- @competitions --> placeholder slide`);
}

const compSlides = loadCompetitions()
  .map(({ data }) => competitionSlide(data))
  .join('\n\n---\n\n');

const deck = source
  .replace(FRONTMATTER, `$1\n<style>\n${theme}</style>\n`)
  .replace(COMPETITIONS_TOKEN, compSlides);

const src = path.join(BUILD_DIR, `${DECK}.slides.md`);
fs.writeFileSync(src, deck);
const out = path.join(DOWNLOADS_DIR, 'strohs-overview-slides.html');
execFileSync(marpBin, [src, '-o', out, '--html'], {
  stdio: 'inherit',
  env: { ...process.env, CHROME_PATH: CHROME },
});
console.log('SLIDES->', path.relative(ROOT, out));
