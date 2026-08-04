import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import { dataUri, heroFile, loadCompetitions } from './lib/content.mjs';
import { BRAND_DIR, CHROME, DOWNLOADS_DIR, ROOT } from './lib/paths.mjs';
import { socialHTML } from '../templates/social.mjs';

fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });

const badge = dataUri(path.join(BRAND_DIR, 'strohs-badge.png'));
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox'],
});

for (const { data } of loadCompetitions()) {
  const hf = heroFile(data);
  const hero = hf && fs.existsSync(hf) ? dataUri(hf) : null;
  const html = socialHTML({ data, badge, hero });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const out = path.join(DOWNLOADS_DIR, `${data.slug}.png`);
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1080, height: 1350 } });
  await page.close();
  console.log('PNG   ->', path.relative(ROOT, out));
}
await browser.close();
