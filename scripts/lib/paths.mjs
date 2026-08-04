import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(fileURLToPath(import.meta.url), '../../..');

export const CONTENT_DIR = path.join(ROOT, 'content');
export const COMPETITIONS_DIR = path.join(CONTENT_DIR, 'competitions');
export const SLIDES_DIR = path.join(ROOT, 'slides');
export const PUBLIC_DIR = path.join(ROOT, 'public');
export const BRAND_DIR = path.join(PUBLIC_DIR, 'brand');
export const DOWNLOADS_DIR = path.join(PUBLIC_DIR, 'downloads');
export const BUILD_DIR = path.join(ROOT, 'build');

export const CHROME =
  process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// Frontmatter image paths are site-absolute (`/brand/x.png`); resolve them under public/.
export const publicAsset = (sitePath) => path.join(PUBLIC_DIR, sitePath);
