import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import { dataUri, heroFile, loadCompetitions } from './lib/content.mjs';
import { BRAND_DIR, CHROME, DOWNLOADS_DIR, ROOT } from './lib/paths.mjs';
import { onePagerHTML } from '../templates/one-pager.mjs';

fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });

const badge = dataUri(path.join(BRAND_DIR, 'strohs-badge.png'));
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox'],
});

for (const { data, bodyHtml } of loadCompetitions()) {
  const hf = heroFile(data);
  const hero = hf && fs.existsSync(hf) ? dataUri(hf) : null;
  const html = onePagerHTML({ data, bodyHtml, badge, hero });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const out = path.join(DOWNLOADS_DIR, `${data.slug}.pdf`);
  await page.pdf({
    path: out,
    format: 'Letter',
    printBackground: true,
    margin: { top: '0.55in', bottom: '0.5in', left: '0.6in', right: '0.6in' },
  });
  await page.close();
  console.log('PDF   ->', path.relative(ROOT, out));
}
await browser.close();
