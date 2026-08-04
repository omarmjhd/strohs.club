import { defineConfig } from 'astro/config';

// The Astro app lives in site/; the markdown source of truth lives in content/,
// loaded as content collections (see site/content.config.mjs).
export default defineConfig({
  site: 'https://www.strohs.club',
  srcDir: './site',
});
