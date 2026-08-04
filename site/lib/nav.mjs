// The single place a content section is registered. Imported by the Astro app
// (Nav.astro, content.config.mjs) and by plain node scripts, so it must stay
// free of `astro:` imports and TypeScript.

// Array order is the cross-group display order; `order` frontmatter sorts within a group.
export const NAV = [
  { group: 'About', dir: 'about', collection: 'pages' },
  { group: 'The Season', dir: 'season', collection: 'pages' },
  { group: 'Competitions', dir: 'competitions', collection: 'competitions' },
  { group: 'Community', dir: '', collection: 'pages', ids: ['community'] },
];

// Pages that belong to no nav group.
export const ROOT_PAGES = ['getting-started', 'standings', 'roll-of-honour'];

// A section is either a single `<dir>.md` file or a `<dir>/` directory of them.
export function pagePatterns() {
  const patterns = ROOT_PAGES.map((id) => `${id}.md`);
  for (const group of NAV) {
    if (group.collection !== 'pages') continue;
    if (group.dir) patterns.push(`${group.dir}.md`, `${group.dir}/**/*.md`);
    for (const id of group.ids ?? []) patterns.push(`${id}.md`);
  }
  return patterns;
}

// `pages` is loaded from `content/`, so its ids carry the directory prefix. Every
// other collection is loaded from its own `dir`, so all of its entries are in-group.
export function matchesGroup(id, group) {
  if (group.ids) return group.ids.includes(id);
  if (group.collection !== 'pages') return true;
  return Boolean(group.dir) && (id === group.dir || id.startsWith(`${group.dir}/`));
}
