// `npm run check` — the friendly gate, run before you push.
//
// Everything here is a rule that already exists somewhere in the build: the collection
// schemas, the nav registry, the draft-marker parser, the canonical link list. This script
// imports each of them rather than restating it, and translates what they say into the file,
// the line and the fix. A second copy of a rule is how this repo has drifted before.

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { NAV, ROOT_PAGES } from '../site/lib/nav.mjs';
import { DISCORD_INVITE } from '../site/lib/links.mjs';
import { FIELD_HELP, schemaFor } from '../site/lib/schema.mjs';
import { CONTENT_DIR, ROOT, publicAsset } from './lib/paths.mjs';
import {
  contentWarnings,
  idOf,
  listMarkdown,
  loadComponent,
  loadNavSections,
} from './lib/content.mjs';
import { findLinkDrift } from './lib/link-drift.mjs';
import { nearest } from './lib/suggest.mjs';

const problems = [];
const notes = [];
const rel = (file) => path.relative(ROOT, file).replace(/\\/g, '/');

// The loaders log their own findings as `!! ORPHAN` / `!! DRAFT MARKER`. We are about to say
// the same things in words an author can use, so keep the raw form out of the report.
const quietly = (fn) => {
  const warn = console.warn;
  console.warn = () => {};
  try {
    return fn();
  } finally {
    console.warn = warn;
  }
};

// `fix` is the sentence an author acts on. Every problem must have one.
const problem = (file, line, what, fix) => problems.push({ file: rel(file), line, what, fix });
const note = (file, line, what, fix) => notes.push({ file: rel(file), line, what, fix });

// Frontmatter is a flat-ish block of `key:` lines, so the first one wins for a key.
const lineOf = (raw, key) => {
  if (!key) return null;
  const lines = raw.split('\n');
  const at = lines.findIndex((l) => new RegExp(`^\\s*-?\\s*['"]?${key}['"]?\\s*:`).test(l));
  return at === -1 ? null : at + 1;
};

const lineContaining = (raw, needle) => {
  const at = raw.split('\n').findIndex((l) => l.includes(needle));
  return at === -1 ? null : at + 1;
};

// Which collection Astro will load a file into, derived from the nav registry rather than
// hard-coded, so registering a new non-`pages` section keeps this honest.
const collectionOf = (id) => {
  for (const group of NAV) {
    if (group.collection === 'pages' || !group.dir) continue;
    if (id.startsWith(`${group.dir}/`)) return group.collection;
  }
  return 'pages';
};

const shapeOf = (collection) => Object.keys(schemaFor(collection).shape);

// zod speaks in paths and type names; an author needs "keyFacts (item 2) value" and "text".
const describePath = (parts) =>
  parts
    .map((p) => (typeof p === 'number' ? `(item ${p + 1})` : p))
    .join(' ')
    .replace(/ \(/g, ' (');

const TYPE_NAMES = {
  string: 'text',
  number: 'a number',
  boolean: 'true or false',
  array: 'a list',
  object: 'a block of indented settings',
  undefined: 'not there',
};
const typeName = (t) => TYPE_NAMES[t] ?? t;

// ---------------------------------------------------------------- schema help stays honest

const documented = new Set(Object.keys(FIELD_HELP));
const undocumented = [...shapeOf('pages'), ...shapeOf('competitions')].filter(
  (f) => !documented.has(f)
);
if (undocumented.length) {
  problem(
    path.join(ROOT, 'site/lib/schema.mjs'),
    null,
    `${undocumented.join(', ')} exist in the schema but have no line in FIELD_HELP.`,
    'Add one sentence per field to FIELD_HELP so this checker can explain it to an author.'
  );
}

// ---------------------------------------------------------------------------- per-file pass

const files = listMarkdown(CONTENT_DIR);
const register = fs.readFileSync(path.join(ROOT, 'docs/RECONCILIATION.md'), 'utf8');
const parsed = [];

for (const file of files) {
  const id = idOf(file);
  const collection = collectionOf(id);
  const raw = fs.readFileSync(file, 'utf8');

  if (!raw.startsWith('---')) {
    problem(
      file,
      1,
      'The file does not start with a settings block.',
      'Every content file opens with a line of three dashes, the settings, then another line ' +
        'of three dashes. Copy docs/templates/new-page.md and start from that.'
    );
    continue;
  }

  let data;
  try {
    ({ data } = matter(raw));
  } catch (err) {
    problem(
      file,
      err.mark?.line != null ? err.mark.line + 1 : null,
      `The settings block could not be read: ${err.reason ?? err.message}`,
      'Usually a missing quote, a stray colon inside an unquoted value, or an indent that ' +
        'does not line up. Wrap the value in "double quotes" and try again.'
    );
    continue;
  }

  parsed.push({ file, id, collection, raw, data });

  // 1 — the schema Astro will use, reported as prose.
  const result = schemaFor(collection).safeParse(data);
  if (!result.success) {
    for (const issue of result.error.issues) {
      const at = issue.path.filter((p) => typeof p === 'string').pop();
      const where = issue.path.length ? describePath(issue.path) : null;
      const root = typeof issue.path[0] === 'string' ? issue.path[0] : null;
      const line = lineOf(raw, at) ?? lineOf(raw, root);

      if (issue.code === 'unrecognized_keys') {
        for (const key of issue.keys) {
          const guess = nearest(key, shapeOf(collection));
          problem(
            file,
            lineOf(raw, key),
            `"${key}" is not a setting this file understands.`,
            guess
              ? `Did you mean "${guess}"? ${FIELD_HELP[guess] ?? ''}`.trim()
              : `Delete it, or use one of: ${shapeOf(collection).join(', ')}.`
          );
        }
        continue;
      }

      if (issue.code === 'invalid_type' && issue.received === 'undefined') {
        problem(
          file,
          line,
          `"${where}" is missing, and it is required.`,
          FIELD_HELP[at] ??
            (issue.path.length > 1
              ? `Add a "${at}:" line to that item — every ${root} entry needs all of its parts.`
              : `Add a ${where}: line to the settings block.`)
        );
        continue;
      }

      if (issue.code === 'invalid_type') {
        problem(
          file,
          line,
          `"${where}" should be ${typeName(issue.expected)}, but it is ${typeName(issue.received)}.`,
          issue.expected === 'number'
            ? `Write it as a bare number — order: 3, not order: "3". ${FIELD_HELP[at] ?? ''}`.trim()
            : FIELD_HELP[at] ?? issue.message
        );
        continue;
      }

      if (issue.code === 'invalid_enum_value') {
        problem(
          file,
          line,
          `"${issue.received}" is not allowed in ${where}.`,
          `Use one of: ${issue.options.join(', ')}. ${FIELD_HELP[at] ?? ''}`.trim()
        );
        continue;
      }

      problem(file, line, `${where ?? 'the settings block'}: ${issue.message}`, FIELD_HELP[at] ?? '');
    }
  }

  // 2 — a page that sets `slug` moves its own URL, silently.
  if (collection === 'pages' && typeof data.slug === 'string') {
    problem(
      file,
      lineOf(raw, 'slug'),
      `This page sets slug: ${data.slug}, which moves its web address away from its file name.`,
      `Delete the slug line. A page's address comes from where the file sits, so this one ` +
        `would be /${id} — with the slug line it becomes /${data.slug} instead.`
    );
  }

  // 3 — a competition's slug is its URL and the name of every file it generates.
  if (collection === 'competitions' && typeof data.slug === 'string') {
    const base = path.basename(file, '.md');
    if (data.slug !== base) {
      note(
        file,
        lineOf(raw, 'slug'),
        `slug: ${data.slug} does not match the file name ${base}.md.`,
        `The page will be /competitions/${data.slug} and the PDF ${data.slug}.pdf. Rename the ` +
          'file to match unless you meant this.'
      );
    }
  }

  // 4 — the draft-marker parser is the build's; only its wording is ours.
  const before = contentWarnings.length;
  try {
    quietly(() => loadComponent(file));
  } catch {
    // A parse failure here was already reported above.
  }
  for (const warning of contentWarnings.slice(before)) {
    const message = warning.slice(warning.indexOf(': ') + 2);
    const idMatch = message.match(/draft:([\w.-]+)/);
    problem(
      file,
      idMatch ? lineContaining(raw, idMatch[0]) : null,
      `Draft marker problem — ${message}`,
      'Every <!-- draft:ID --> needs a matching <!-- /draft:ID --> later in the file, each on ' +
        'a line of its own, and they cannot overlap. The prose between them stays on the ' +
        'website and is left out of the PDFs, images, decks and the Almanac.'
    );
  }

  // 5 — a draft file generates no documents, so it must not advertise any.
  if (data.status === 'draft') {
    const advertised = (Array.isArray(data.outputs) ? data.outputs : []).filter((o) => o !== 'page');
    if (advertised.length) {
      problem(
        file,
        lineOf(raw, 'outputs'),
        `status: draft stops every document being built, but outputs still asks for ` +
          `${advertised.join(', ')}.`,
        'The page would show download links to files that do not exist. Set outputs: [page] ' +
          'while the file is a draft, and restore the rest when it is confirmed.'
      );
    }
  }

  // 6 — a missing image is invisible on the site and blank in the PDF.
  for (const key of ['hero', 'heroImage', 'logo']) {
    const value = data[key];
    if (typeof value !== 'string' || !value.startsWith('/')) continue;
    if (!fs.existsSync(publicAsset(value))) {
      problem(
        file,
        lineOf(raw, key),
        `${key} points at ${value}, and there is no such file in public/.`,
        `Check the spelling, or pick one of: ${fs
          .readdirSync(path.join(ROOT, 'public/brand'))
          .filter((f) => /\.(png|jpg|jpeg|svg)$/i.test(f))
          .slice(0, 6)
          .map((f) => `/brand/${f}`)
          .join(', ')}, …`
      );
    }
  }

  // 7 — a marker ID is a row in the register; a typo'd one tracks nothing.
  const declared = new Set([
    ...(Array.isArray(data.draftIds) ? data.draftIds.map(String) : []),
    ...[...raw.matchAll(/<!--\s*\/?draft:([\w.-]+)\s*-->/g)].map((m) => m[1]),
  ]);
  for (const draftId of declared) {
    if (!register.includes(draftId)) {
      note(
        file,
        lineContaining(raw, draftId),
        `Draft ID ${draftId} is not listed in docs/RECONCILIATION.md.`,
        'Add a row for it there so somebody knows what is waiting to be confirmed.'
      );
    }
  }
}

// ------------------------------------------------------------------ where the file will land

// loadNavSections() is what the artifact pipeline uses to decide document order; anything it
// does not claim is a file the site and the documents will both ignore.
const claimed = new Set(
  quietly(loadNavSections).flatMap((section) => section.entries.map((entry) => entry.file))
);

const destinations = () => {
  const lines = [];
  for (const group of NAV) {
    if (!group.dir) continue;
    const example = group.collection === 'competitions' ? 'your-event' : 'your-page';
    lines.push(`content/${group.dir}/${example}.md  — appears under "${group.group}"`);
  }
  lines.push(
    `content/<name>.md, once someone adds '<name>' to ROOT_PAGES in site/lib/nav.mjs ` +
      `— a page in no menu, like ${ROOT_PAGES.join(', ')}`
  );
  return lines;
};

for (const { file, id } of parsed) {
  if (claimed.has(file)) continue;
  problem(
    file,
    null,
    'Nothing will use this file: it is not in any nav section, so it builds no page, no menu ' +
      'entry and no documents.',
    `It is at content/${id}.md. Move it to one of these:\n${destinations()
      .map((l) => `  ${l}`)
      .join('\n')}`
  );
}

// ------------------------------------------------------------------------- two files, one URL

const byAddress = new Map();
for (const { file, id, collection, data } of parsed) {
  // Astro's glob loader uses `data.slug` as the entry id whenever it is present.
  const address = `${collection}:${typeof data.slug === 'string' ? data.slug : id}`;
  byAddress.set(address, [...(byAddress.get(address) ?? []), file]);
}
for (const [address, group] of byAddress) {
  if (group.length < 2) continue;
  for (const file of group) {
    problem(
      file,
      null,
      `This file and ${group
        .filter((f) => f !== file)
        .map(rel)
        .join(', ')} both claim ${address.split(':')[1]}.`,
      'Only one of them will exist on the site — the other is dropped without an error. ' +
        'Rename one file, or remove the slug line that is forcing the clash.'
    );
  }
}

// ----------------------------------------------------------------------------- shared links

for (const { file, line, url } of findLinkDrift()) {
  problem(
    path.join(ROOT, file),
    line,
    `${url} is not the invite the rest of the site uses.`,
    `The one true copy lives in site/lib/links.mjs — today it is ${DISCORD_INVITE}. Either ` +
      'use that exact URL here, or, if the invite really has been replaced, change ' +
      'site/lib/links.mjs first and then every file that quotes it.'
  );
}

// ---------------------------------------------------------------------------------- report

const byFileThenLine = (a, b) =>
  a.file.localeCompare(b.file) || (a.line ?? 0) - (b.line ?? 0);

const render = (items, heading) => {
  console.log(`\n${heading}\n`);
  let current = null;
  for (const item of [...items].sort(byFileThenLine)) {
    if (item.file !== current) {
      current = item.file;
      console.log(`  ${current}`);
    }
    console.log(`    ${(item.line ? `line ${item.line}` : '').padEnd(9)}${item.what}`);
    if (item.fix) {
      const [first, ...rest] = item.fix.split('\n');
      console.log(`             > ${first}`);
      for (const line of rest) console.log(`               ${line}`);
    }
    console.log('');
  }
};

const counted = (n, singular) => `${n} ${singular}${n === 1 ? '' : 's'}`;

if (problems.length) render(problems, `Found ${counted(problems.length, 'problem')}:`);
if (notes.length) render(notes, `${counted(notes.length, 'thing')} worth a look:`);

const pages = parsed.filter((p) => p.collection === 'pages').length;
const comps = parsed.length - pages;
const summary = `${counted(parsed.length, 'file')} checked — ${pages} pages, ${comps} competitions.`;

if (problems.length) {
  console.log(`${summary} Fix the problems above and run npm run check again.\n`);
  process.exit(1);
}
console.log(`${summary} All good — safe to push.\n`);
