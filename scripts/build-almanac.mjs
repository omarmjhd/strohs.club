import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import { dataUri, loadNavSections } from './lib/content.mjs';
import { BRAND_DIR, CHROME, DOWNLOADS_DIR, ROOT } from './lib/paths.mjs';
import { almanacHTML } from '../templates/almanac.mjs';

fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });

function omissionsFor(entry) {
  const title = entry.data.title;
  if (entry.isDraft) {
    const ids = entry.drafts.filter((d) => d.whole).map((d) => d.id);
    return [...new Set(ids.length ? ids : ['unassigned'])].map((id) => ({ id, title, whole: true }));
  }
  const counts = new Map();
  for (const d of entry.drafts) counts.set(d.id, (counts.get(d.id) ?? 0) + 1);
  return [...counts].map(([id, count]) => ({ id, title, count }));
}

const allSections = loadNavSections();

const omissions = allSections
  .flatMap((section) => section.entries)
  .flatMap(omissionsFor)
  .sort((a, b) => a.id.localeCompare(b.id));

const sections = allSections
  .map((section) => ({ ...section, entries: section.entries.filter((e) => !e.isDraft) }))
  .filter((section) => section.entries.length);

const generated = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const html = almanacHTML({
  sections,
  badge: dataUri(path.join(BRAND_DIR, 'strohs-badge.png')),
  omissions,
  generated,
});

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox'],
});
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle0' });

const out = path.join(DOWNLOADS_DIR, 'strohs-almanac.pdf');
await page.pdf({
  path: out,
  format: 'Letter',
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: '<div></div>',
  footerTemplate:
    '<div style="width:100%;font-family:Helvetica,Arial,sans-serif;font-size:8pt;color:#8a8a99;padding:0 0.55in;display:flex;justify-content:space-between">' +
    "<span>The STROH's Almanac · strohs.club</span><span class=\"pageNumber\"></span></div>",
  margin: { top: '0.5in', bottom: '0.6in', left: '0.55in', right: '0.55in' },
});
await page.close();
await browser.close();

const count = sections.reduce((n, s) => n + s.entries.length, 0);
console.log(`ALMANAC-> ${path.relative(ROOT, out)} (${count} components, ${omissions.length} omissions)`);
