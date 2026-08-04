import { execFileSync } from 'node:child_process';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { forOutput, loadCompetitions } from './lib/content.mjs';
import { BUILD_DIR, CHROME, DOWNLOADS_DIR, ROOT, SLIDES_DIR } from './lib/paths.mjs';

const DECK = 'onboarding';
const COMPETITIONS_TOKEN = /<!--\s*@competitions\s*-->/;
const FRONTMATTER = /^(---\r?\n[\s\S]*?\r?\n---\r?\n)/;

fs.mkdirSync(BUILD_DIR, { recursive: true });
fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
const marpBin = path.join(ROOT, 'node_modules/.bin/marp');


// Art is embedded rather than linked: the deck is a downloadable artifact, and a saved copy
// with broken images is worse than a larger file. Everything is downscaled to roughly twice
// its display size first — the ASO logo is 365 KB of source for a 42px-tall card badge.
const ART_DIRS = [path.join(ROOT, 'public/brand'), path.join(ROOT, 'Logos-Art')];
const IMG_TOKEN = /<!--\s*@img:([\w.-]+)(?:\s+class=([\w-]+))?\s*-->/g;
const CARD_ART = 96;
const ART_HEIGHT = {
  'strohs-badge.png': 460,
  'lion.png': 500,
  'StrohsSweetensBarrell.png': 600,
  'strohs-script.png': 240,
};

function artPath(file) {
  const found = ART_DIRS.map((d) => path.join(d, file)).find((f) => fs.existsSync(f));
  if (!found) throw new Error(`deck art not found: ${file}`);
  return found;
}

async function artUri(file) {
  const buf = await sharp(artPath(file))
    .resize({ height: ART_HEIGHT[file] ?? CARD_ART, withoutEnlargement: true, fit: 'inside' })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();
  return `data:image/png;base64,${buf.toString('base64')}`;
}

async function embedArt(src) {
  let out = src;
  for (const [full, file, cls] of [...src.matchAll(IMG_TOKEN)]) {
    out = out.replace(full, `<img class="${cls || 'art'}" src="${await artUri(file)}" alt="">`);
  }
  return out;
}

const theme = fs.readFileSync(path.join(SLIDES_DIR, 'theme.css'), 'utf8');
const withTheme = (source) => source.replace(FRONTMATTER, `$1\n<style>\n${theme}</style>\n`);

function render(name, markdown, outFile) {
  const src = path.join(BUILD_DIR, `${name}.slides.md`);
  fs.writeFileSync(src, markdown);
  const out = path.join(DOWNLOADS_DIR, outFile);
  execFileSync(marpBin, [src, '-o', out, '--html'], {
    stdio: 'inherit',
    env: { ...process.env, CHROME_PATH: CHROME },
  });
  console.log('SLIDES->', path.relative(ROOT, out));
}

// One slide for all five, as a card grid — five near-identical slides read as filler in a
// deck whose job is to get someone up to speed in five minutes.
async function competitionsSlide(entries) {
  const cards = (await Promise.all(entries
    .map(async ({ data }) => {
      const facts = (data.keyFacts || []).slice(0, 1);
      const rows = facts
        .map((f) => `<div class="cf"><span>${f.label}</span>${f.value}</div>`)
        .join('');
      const logo = data.logo ? `<img class="cl" src="${await artUri(path.basename(data.logo))}" alt="">` : '';
      return `<div class="cc" style="--cc:${data.accent || '#2B3350'}">
${logo}
<div class="ct">${data.title}</div>
<div class="cd">${data.blurb || data.tagline || ''}</div>
${rows}
</div>`;
    })))
    .join('\n');
  return `## The Competitions\n\n<div class="cgrid">\n${cards}\n</div>`;
}

const bullets = (items) => items.map((f) => `- **${f.label}:** ${f.value}`).join('\n');

function componentDeck({ data }) {
  const slides = [
    `<!-- _class: title -->\n\n<span class="kicker">STROH's</span>\n\n# ${data.title}\n\n${data.tagline || ''}`,
  ];
  if (data.summary) slides.push(`## The Short Version\n\n${data.summary}`);
  const keyFacts = data.keyFacts || [];
  if (keyFacts.length) slides.push(`## Key Facts\n\n${bullets(keyFacts)}`);
  const scoring = data.social?.scoring || [];
  if (scoring.length) slides.push(`## How It Works\n\n${scoring.map((s) => `- ${s}`).join('\n')}`);
  slides.push(
    "## Get Involved\n\n- Hop in our Discord: **discord.gg/frNSUn5ZmC**\n- Head straight to **#new-people-start-here**.\n- Come play golf. That's it."
  );
  return `---\nmarp: true\npaginate: true\n---\n\n${slides.join('\n\n---\n\n')}\n`;
}

const source = fs.readFileSync(path.join(SLIDES_DIR, `${DECK}.md`), 'utf8');

if (!COMPETITIONS_TOKEN.test(source)) {
  throw new Error(`${DECK}.md is missing the <!-- @competitions --> placeholder slide`);
}

const compSlides = await competitionsSlide(
  loadCompetitions().filter(
    (entry) => !entry.isDraft && (entry.data.kind ?? 'competition') === 'competition'
  )
);

render(
  DECK,
  await embedArt(withTheme(source).replace(COMPETITIONS_TOKEN, compSlides)),
  'strohs-overview-slides.html'
);

for (const entry of forOutput('slides')) {
  render(entry.slug, await embedArt(withTheme(componentDeck(entry))), `${entry.slug}-slides.html`);
}
