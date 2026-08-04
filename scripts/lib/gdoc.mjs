// Turns a Google Doc or Google Sheet into the markdown file the rest of the build already
// understands. Nothing here touches the network or the disk, so the transform can be
// exercised on a saved export; scripts/sync-gdocs.mjs does the fetching and the writing.
//
// Both shapes reduce to the same thing: a list of [label, value] settings, then body lines.
// In a Sheet the settings are rows; in a Doc they are a two-column table at the top.

import { FIELD_HELP, schemaFor } from '../../site/lib/schema.mjs';
import { nearest } from './suggest.mjs';

// Plain-English column A entries, and what they set. Several words for the same field
// because an administrator should not have to remember ours.
const LABELS = {
  title: 'title',
  name: 'title',
  'web address': 'slug',
  address: 'slug',
  slug: 'slug',
  order: 'order',
  position: 'order',
  tagline: 'tagline',
  'one liner': 'tagline',
  'one-liner': 'tagline',
  subtitle: 'subtitle',
  blurb: 'blurb',
  'card text': 'blurb',
  summary: 'summary',
  intro: 'summary',
  kind: 'kind',
  accent: 'accent',
  colour: 'accent',
  color: 'accent',
  'second colour': 'accent2',
  artwork: 'hero',
  hero: 'hero',
  image: 'hero',
  logo: 'logo',
  'standings sheet': 'standingsUrl',
  documents: 'outputs',
  outputs: 'outputs',
  status: 'status',
  'draft ids': 'draftIds',
};

// A Doc author writes "Documents", never "outputs". Errors have to name the row they typed,
// so map the field back to the friendliest label that sets it.
const PREFERRED_LABEL = {
  title: 'Title',
  slug: 'Slug',
  order: 'Order',
  tagline: 'One-liner',
  subtitle: 'Subtitle',
  blurb: 'Card text',
  summary: 'Summary',
  accent: 'Colour',
  accent2: 'Second colour',
  hero: 'Artwork',
  logo: 'Logo',
  standingsUrl: 'Standings sheet',
  outputs: 'Documents',
  status: 'Status',
  draftIds: 'Draft ids',
  kind: 'Kind',
};

export const labelFor = (field) =>
  PREFERRED_LABEL[field] ??
  Object.keys(LABELS).find((k) => LABELS[k] === field) ??
  field;

const FACT_LABEL = /^(?:key |quick )?fact:\s*(.+)$/i;
const LIST_FIELDS = new Set(['outputs', 'draftIds']);
const NUMBER_FIELDS = new Set(['order']);

const normalise = (label) => label.trim().replace(/\s+/g, ' ').replace(/:$/, '').toLowerCase();

export function parseCsv(text) {
  const rows = [[]];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') (field += '"'), i++;
      else if (c === '"') quoted = false;
      else field += c;
      continue;
    }
    if (c === '"') quoted = true;
    else if (c === ',') (rows.at(-1).push(field), (field = ''));
    else if (c === '\n') (rows.at(-1).push(field), (field = ''), rows.push([]));
    else if (c !== '\r') field += c;
  }
  rows.at(-1).push(field);
  // Blank rows are kept: inside the body they are the paragraph breaks.
  while (rows.length && rows.at(-1).every((cell) => cell.trim() === '')) rows.pop();
  return rows;
}

// A sheet is two columns: the setting's name, then its value. Everything after a row
// labelled "Body" is the page text, one row per paragraph or bullet.
export function fromSheet(csv) {
  const settings = [];
  const body = [];
  let inBody = false;
  for (const [label = '', value = ''] of parseCsv(csv)) {
    if (inBody) {
      body.push(value.trim() === '' ? label.trimEnd() : value.trimEnd());
      continue;
    }
    if (normalise(label) === 'body') {
      inBody = true;
      if (value.trim()) body.push(value.trimEnd());
      continue;
    }
    if (label.trim() && normalise(label) !== 'setting') settings.push([label, value]);
  }
  return { settings, body };
}

// Google Docs exports a two-column table as a markdown table. Anything before the table is
// the doc's own title block and is dropped; anything after it is the page text.
export function fromDocMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const settings = [];
  const body = [];
  // The settings table has to come first, or a table used inside the page would be read as
  // settings and the prose above it thrown away. Only blank lines and the Doc's own title
  // heading may precede it.
  let open = true;

  for (const line of lines) {
    const cells = line.trim().match(/^\|(.*)\|$/);
    if (open && cells) {
      const parts = cells[1].split('|').map((c) => c.trim());
      if (parts.every((p) => /^:?-{2,}:?$/.test(p))) continue;
      if (normalise(parts[0] ?? '') === 'setting') continue;
      settings.push([parts[0] ?? '', parts.slice(1).join(' | ')]);
      continue;
    }
    if (open && !line.trim()) continue;
    if (open && !settings.length && /^#\s/.test(line)) continue;
    if (open) open = false;
    body.push(line.trimEnd());
  }
  return { settings, body };
}

const cleanValue = (raw) =>
  raw
    .replace(/ /g, ' ')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .trim();

// Settings + body lines -> the frontmatter object and the markdown body, or a list of
// problems phrased in terms of the Doc, since that is the file the author is looking at.
export function toComponent({ settings, body }, { collection, factsField }) {
  const known = Object.keys(schemaFor(collection).shape);
  const front = {};
  const facts = [];
  const problems = [];

  for (const [rawLabel, rawValue] of settings) {
    const label = normalise(rawLabel);
    const value = cleanValue(rawValue);
    if (!value) continue;

    const fact = rawLabel.trim().match(FACT_LABEL);
    if (fact) {
      facts.push({ label: cleanValue(fact[1]), value });
      continue;
    }

    const field = LABELS[label];
    if (!field || !known.includes(field)) {
      const guess = nearest(label, Object.keys(LABELS).filter((l) => known.includes(LABELS[l])));
      problems.push(
        `"${rawLabel.trim()}" is not something this page has.` +
          (guess ? ` Did you mean "${guess}"? ${FIELD_HELP[LABELS[guess]] ?? ''}`.trimEnd() : '')
      );
      continue;
    }

    if (NUMBER_FIELDS.has(field)) {
      const n = Number(value);
      if (Number.isNaN(n)) problems.push(`"${rawLabel.trim()}" must be a number, not "${value}".`);
      else front[field] = n;
    } else if (LIST_FIELDS.has(field)) {
      front[field] = value.split(/[,\n]/).map((v) => v.trim()).filter(Boolean);
    } else {
      front[field] = value;
    }
  }

  if (facts.length) front[factsField] = facts;

  let text = body.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  // The layout already prints the title; a Doc that repeats it as its first heading would
  // show it twice.
  if (front.title && text.startsWith(`# ${front.title}`)) {
    text = text.slice(text.indexOf('\n') + 1).trimStart();
  }
  return { front, body: text, problems };
}

// A deliberately small YAML writer: double-quoted scalars are valid YAML and never need
// escaping rules of their own, so a value with a colon or a hash in it cannot break the file.
const scalar = (value) => (typeof value === 'number' ? String(value) : JSON.stringify(String(value)));

export function toMarkdown(front, body, { collection, from, sourceHash }) {
  const order = Object.keys(schemaFor(collection).shape);
  const keys = Object.keys(front).sort((a, b) => order.indexOf(a) - order.indexOf(b));
  const lines = ['---'];
  if (from) {
    lines.push(
      '# Generated by `npm run sync` from a Google file. Edits made here are overwritten on',
      `# the next sync — change the original instead: ${from}`
    );
    // Google's unauthenticated export carries no ETag, Last-Modified or revision id, so the
    // only provenance available is the source itself: this is a hash of exactly the text the
    // file was built from. Same hash means the Doc has not changed since.
    if (sourceHash) lines.push(`# source-hash: ${sourceHash}`);
  }
  for (const key of keys) {
    const value = front[key];
    if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
      lines.push(`${key}: [${value.join(', ')}]`);
    } else if (Array.isArray(value)) {
      lines.push(`${key}:`);
      for (const item of value) {
        lines.push(`  - label: ${scalar(item.label)}`);
        lines.push(`    value: ${scalar(item.value)}`);
      }
    } else {
      lines.push(`${key}: ${scalar(value)}`);
    }
  }
  lines.push('---', '', body, '');
  return lines.join('\n');
}

// Any Google URL an administrator is likely to paste, turned into the one that returns
// something a machine can read. Both need the file shared so that anyone with the link can
// view it, or published to the web.
export function exportUrl(url) {
  const published = url.match(/\/spreadsheets\/d\/e\/([\w-]+)\/pub/);
  if (published) {
    const gid = url.match(/[?&]gid=(\d+)/)?.[1];
    return `https://docs.google.com/spreadsheets/d/e/${published[1]}/pub?${
      gid ? `gid=${gid}&single=true&` : ''
    }output=csv`;
  }
  const sheet = url.match(/\/spreadsheets\/d\/([\w-]+)/);
  if (sheet) {
    const gid = url.match(/[#?&]gid=(\d+)/)?.[1] ?? '0';
    return `https://docs.google.com/spreadsheets/d/${sheet[1]}/export?format=csv&gid=${gid}`;
  }
  const doc = url.match(/\/document\/d\/(?:e\/)?([\w-]+)/);
  if (doc) return `https://docs.google.com/document/d/${doc[1]}/export?format=md`;
  return null;
}

export const kindOf = (url) => (/\/document\//.test(url) ? 'doc' : 'sheet');
