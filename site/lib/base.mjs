// Astro's `base` only rewrites imported assets and Astro.url — it does not touch literal
// paths in markup, frontmatter, or markdown links. Everything root-relative that reaches the
// browser has to go through here, or it 404s when the site is served from a subpath.
//
// Keeping the stored values root-relative matters: scripts/ resolves `hero`/`logo` against
// public/ on disk, where the base prefix does not exist.

const BASE = import.meta.env.BASE_URL;

export function withBase(path) {
  if (!path) return path;
  if (/^(https?:)?\/\//.test(path) || path.startsWith('#') || path.startsWith('mailto:')) {
    return path;
  }
  if (!path.startsWith('/')) return path;
  return `${BASE}${path}`.replace(/\/{2,}/g, '/');
}
