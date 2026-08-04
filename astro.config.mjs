import { defineConfig } from 'astro/config';
import { DRAFT_MARKER } from './scripts/lib/content.mjs';

// The Astro app lives in site/; the markdown source of truth lives in content/,
// loaded as content collections (see site/content.config.mjs).

// Until DNS moves, the site is served from a subpath: the account's user Pages site is
// omarmujahidpair.com, so this project lands at omarmujahidpair.com/strohs.club/. At the
// cutover this becomes site: 'https://strohs.club', base: '/', plus a public/CNAME.
const SITE = 'https://omarmujahidpair.com';
const BASE = '/strohs.club';

// Draft markers are editorial metadata for the artifact pipeline, which drops the
// prose between them. The site keeps that prose but must not publish the markers:
// markdown passes HTML comments straight through to the rendered page.
function remarkStripDraftMarkers() {
  return (tree) => {
    const walk = (node) => {
      if (!node.children) return;
      node.children = node.children.filter((child) => {
        if (child.type === 'html') {
          child.value = child.value.replace(DRAFT_MARKER, '').trim();
          if (!child.value) return false;
        }
        walk(child);
        return true;
      });
    };
    walk(tree);
  };
}

// Markdown bodies contain root-relative links (`/competitions/muni-tour`) and raw <img src>.
// Astro's `base` does not rewrite them, so they 404 when served from a subpath. Rewriting
// here keeps the markdown itself portable — the source stays root-relative, which is also
// what scripts/ needs, since it resolves those paths against public/ on disk.
function rehypeBasePaths() {
  const attrs = { a: 'href', img: 'src', source: 'src' };
  return (tree) => {
    const walk = (node) => {
      const attr = attrs[node.tagName];
      const value = attr && node.properties?.[attr];
      if (typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')) {
        node.properties[attr] = `${BASE}${value}`.replace(/\/{2,}/g, '/');
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}

export default defineConfig({
  site: SITE,
  base: BASE,
  srcDir: './site',
  markdown: {
    remarkPlugins: [remarkStripDraftMarkers],
    rehypePlugins: [rehypeBasePaths],
  },
});
