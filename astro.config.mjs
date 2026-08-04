import { defineConfig } from 'astro/config';
import { DRAFT_MARKER } from './scripts/lib/content.mjs';

// The Astro app lives in site/; the markdown source of truth lives in content/,
// loaded as content collections (see site/content.config.mjs).

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

export default defineConfig({
  site: 'https://www.strohs.club',
  srcDir: './site',
  markdown: {
    remarkPlugins: [remarkStripDraftMarkers],
  },
});
