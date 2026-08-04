import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import { NAV, ROOT_PAGES } from '../../site/lib/nav.mjs';
import { CONTENT_DIR, publicAsset } from './paths.mjs';

const md = new MarkdownIt({ html: true, linkify: true, typographer: true });

// Global, so `exec`/`test` callers must reset `lastIndex` first.
export const DRAFT_MARKER = /<!--\s*(\/?)draft:([\w.-]+)\s*-->/g;

// A malformed draft marker fails OPEN — the prose it was meant to withhold flows into every
// artifact. Since that prose is unratified rules and entry fees, a warning nobody reads is not
// enough: record it so the build can exit non-zero.
export const contentWarnings = [];
const warn = (where, message) => {
  const line = `${where}: ${message}`;
  contentWarnings.push(line);
  console.warn(`!! DRAFT MARKER  ${line}`);
};

// `<!-- draft:D-01 -->…<!-- /draft:D-01 -->` hides unratified prose from generated
// artifacts while leaving it on the site.
export function stripDrafts(markdown, where = 'content') {
  const open = [];
  const drafts = [];
  let out = '';
  let cursor = 0;
  let match;

  DRAFT_MARKER.lastIndex = 0;
  while ((match = DRAFT_MARKER.exec(markdown))) {
    const [marker, closing, id] = match;
    const after = match.index + marker.length;

    if (!closing) {
      if (open.length === 0) out += markdown.slice(cursor, match.index);
      else warn(where, `draft:${id} opened inside draft:${open[open.length - 1].id}`);
      open.push({ id, start: after });
      cursor = after;
      continue;
    }

    const current = open[open.length - 1];
    if (!current) {
      warn(where, `/draft:${id} closes a block that was never opened`);
      out += markdown.slice(cursor, match.index);
      cursor = after;
      continue;
    }
    if (current.id !== id) {
      warn(where, `/draft:${id} does not match the open draft:${current.id} — ignored`);
      cursor = after;
      continue;
    }

    open.pop();
    if (open.length === 0) drafts.push({ id, chars: match.index - current.start });
    cursor = after;
  }

  if (open.length) {
    const unclosed = open[0];
    warn(where, `draft:${unclosed.id} is never closed — keeping the rest of the file`);
    out += markdown.slice(unclosed.start);
    cursor = markdown.length;
  }

  out += markdown.slice(cursor);
  return { content: drafts.length ? out.replace(/\n{3,}/g, '\n\n') : out, drafts };
}

const hasMarker = (text) => {
  DRAFT_MARKER.lastIndex = 0;
  return DRAFT_MARKER.test(text);
};

const isEmpty = (value) =>
  value === '' ||
  (Array.isArray(value) && value.length === 0) ||
  (value?.constructor === Object && Object.keys(value).length === 0);

// keyFacts, summaries and social blocks state the same unratified facts as the body, so
// a frontmatter value that is entirely draft-marked drops out with it. List items are
// records — a `{label, value}` fact that loses either half is dropped whole, where a
// top-level frontmatter key losing its value only drops that key.
function stripFrontmatter(value, where, drafts, record = false) {
  if (typeof value === 'string') {
    const result = stripDrafts(value, where);
    drafts.push(...result.drafts);
    return result.drafts.length ? result.content.trim() : value;
  }
  if (Array.isArray(value)) {
    return value.map((v) => stripFrontmatter(v, where, drafts, true)).filter((v) => !isEmpty(v));
  }
  if (value?.constructor === Object) {
    const entries = Object.entries(value).map(([k, v]) => [k, stripFrontmatter(v, where, drafts)]);
    if (record && entries.some(([, v]) => isEmpty(v))) return {};
    return Object.fromEntries(entries.filter(([, v]) => !isEmpty(v)));
  }
  return value;
}

const idOf = (file) => path.relative(CONTENT_DIR, file).replace(/\\/g, '/').replace(/\.md$/, '');

// Reconciliation register IDs for a whole-file draft; the marker form carries its own.
const fileDraftIds = (data) => {
  const declared = data.draftIds ?? data.draftId ?? data.reconciliation;
  const ids = Array.isArray(declared) ? declared : declared ? [declared] : [];
  return ids.map(String);
};

export function loadComponent(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const { data, content } = matter(raw);
  const id = idOf(file);
  const { content: stripped, drafts } = stripDrafts(content, id);
  const front = hasMarker(JSON.stringify(data)) ? stripFrontmatter(data, id, drafts) : data;
  const isDraft = front.status === 'draft';
  const whole = isDraft ? fileDraftIds(front).map((i) => ({ id: i, whole: true })) : [];
  return {
    file,
    id,
    slug: front.slug || id.replace(/\//g, '-'),
    data: front,
    content: stripped,
    bodyMd: stripped,
    bodyHtml: md.render(stripped),
    drafts: [...whole, ...drafts],
    isDraft,
  };
}

function listMarkdown(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) => {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) return listMarkdown(full);
      return e.isFile() && e.name.endsWith('.md') ? [full] : [];
    })
    .sort();
}

// A file can vanish mid-run while another track rewrites the tree.
function tryLoad(file) {
  try {
    return loadComponent(file);
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
}

const byOrderThenTitle = (a, b) =>
  (a.data.order ?? 999) - (b.data.order ?? 999) ||
  String(a.data.title ?? '').localeCompare(String(b.data.title ?? ''));

export function loadSection(dir) {
  return listMarkdown(path.join(CONTENT_DIR, dir))
    .map((file) => tryLoad(file))
    .filter(Boolean)
    .sort(byOrderThenTitle);
}

export function loadCompetitions() {
  return loadSection('competitions');
}

// Nav order is the document order for every compiled artifact. A section is either a
// single `<dir>.md` or a `<dir>/` of files, so both shapes are probed.
export function loadNavSections() {
  const seen = new Set();
  const claim = (entries) =>
    entries.filter((entry) => entry && !seen.has(entry.file) && seen.add(entry.file));

  const sections = [];
  const rootEntries = claim(ROOT_PAGES.map((id) => tryLoad(path.join(CONTENT_DIR, `${id}.md`))));
  if (rootEntries.length) {
    sections.push({ group: null, entries: rootEntries.sort(byOrderThenTitle) });
  }

  for (const group of NAV) {
    const candidates = [];
    if (group.dir) {
      candidates.push(tryLoad(path.join(CONTENT_DIR, `${group.dir}.md`)));
      candidates.push(...loadSection(group.dir));
    }
    for (const id of group.ids ?? []) candidates.push(tryLoad(path.join(CONTENT_DIR, `${id}.md`)));
    const entries = claim(candidates).sort(byOrderThenTitle);
    if (entries.length) sections.push({ group: group.group, entries });
  }

  for (const file of listMarkdown(CONTENT_DIR)) {
    if (!seen.has(file)) {
      const line = `${idOf(file)} is in no nav group — skipped`;
      contentWarnings.push(line);
      console.warn(`!! ORPHAN  ${line}`);
    }
  }
  return sections;
}

export function loadAll() {
  return loadNavSections().flatMap((section) => section.entries);
}

const outputsOf = (data) => (Array.isArray(data.outputs) ? data.outputs : ['page']);

// `outputs` is the single gate on which artifacts a component produces; a whole-file
// draft produces none.
export const wants = (entry, output) => !entry.isDraft && outputsOf(entry.data).includes(output);

export const forOutput = (output) => loadAll().filter((entry) => wants(entry, output));

export function dataUri(file) {
  const ext = path.extname(file).slice(1).toLowerCase();
  const mime = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
  return `data:${mime};base64,` + fs.readFileSync(file).toString('base64');
}

export function heroFile(data) {
  const hero = data.hero || data.heroImage;
  return hero ? publicAsset(hero) : null;
}
