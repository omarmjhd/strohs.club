// `npm run sync` — pull the components that are authored in Google Drive.
//
// An administrator who will never open GitHub keeps a Google Doc (or a Sheet). This reads
// each one registered in content-sources.json, converts it to the markdown file the rest of
// the build already understands, and writes it only if something actually changed. The
// generated file is committed like any other, so the site keeps building from content/ and
// git still shows what changed and when.
//
//   node scripts/sync-gdocs.mjs            fetch, convert, write
//   node scripts/sync-gdocs.mjs --dry-run  say what would change, write nothing

import fs from 'node:fs';
import path from 'node:path';
import { schemaFor } from '../site/lib/schema.mjs';
import { ROOT } from './lib/paths.mjs';
import { nearest } from './lib/suggest.mjs';
import {
  exportUrl,
  fromDocMarkdown,
  fromSheet,
  kindOf,
  labelFor,
  toComponent,
  toMarkdown,
} from './lib/gdoc.mjs';

const REGISTRY = path.join(ROOT, 'content-sources.json');
const dryRun = process.argv.includes('--dry-run');

if (!fs.existsSync(REGISTRY)) {
  console.log('No content-sources.json — nothing is authored in Google Drive yet.');
  process.exit(0);
}

const { sources = [] } = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));
if (!sources.length) {
  console.log('content-sources.json lists no sources yet. See docs/AUTHORING-GOOGLE-DRIVE.md.');
  process.exit(0);
}

const problems = [];
let changed = 0;

const banner = (source) => `${source.file}  <-  ${source.note ?? source.from}`;

for (const source of sources) {
  const target = path.join(ROOT, source.file);
  const collection = source.file.includes('/competitions/') ? 'competitions' : 'pages';
  const url = exportUrl(source.from);

  if (!url) {
    problems.push(`${banner(source)}\n    That is not a Google Doc or Google Sheet link.`);
    continue;
  }

  let text;
  try {
    const response = await fetch(url, { redirect: 'follow' });
    if (!response.ok) throw new Error(`Google said ${response.status} ${response.statusText}`);
    text = await response.text();
  } catch (err) {
    problems.push(
      `${banner(source)}\n    Could not read it: ${err.message}\n` +
        '    In Google Drive: Share > General access > Anyone with the link > Viewer.'
    );
    continue;
  }

  if (/^\s*<(?:!doctype|html)/i.test(text)) {
    problems.push(
      `${banner(source)}\n    Google returned its sign-in page instead of the file.\n` +
        '    In Google Drive: Share > General access > Anyone with the link > Viewer.'
    );
    continue;
  }

  const raw = kindOf(source.from) === 'doc' ? fromDocMarkdown(text) : fromSheet(text);
  const { front, body, problems: found } = toComponent(raw, {
    collection,
    factsField: collection === 'competitions' ? 'keyFacts' : 'quickFacts',
  });

  if (collection === 'competitions' && !front.slug) front.slug = path.basename(source.file, '.md');

  const result = schemaFor(collection).safeParse(front);

  // Report in the words the author used. A Doc has a "Documents" row, never an `outputs`
  // field, so a message naming the field cannot be matched back to anything they typed.
  const describe = (issue) => {
    const field = issue.path[0];
    const label = field ? labelFor(String(field)) : 'the settings table';
    if (issue.code === 'invalid_type' && issue.received === 'undefined') {
      return `There is no "${label}" row, and it is required.`;
    }
    if (issue.code === 'invalid_enum_value') {
      const allowed = issue.options ?? [];
      const near = nearest(String(issue.received), allowed);
      return (
        `"${label}" does not accept "${issue.received}". Use any of: ${allowed.join(', ')}.` +
        (near ? ` Did you mean "${near}"?` : '')
      );
    }
    if (issue.code === 'unrecognized_keys') {
      return `Not a setting this page understands: ${issue.keys.map(labelFor).join(', ')}.`;
    }
    return `"${label}": ${issue.message}`;
  };

  const issues = [...found, ...(result.success ? [] : result.error.issues.map(describe))];

  // The filename decides the address; a slug that disagrees silently renames the page and
  // every file it generates. `npm run check` catches this later, but by then the sync has
  // already written and committed the file.
  const expected = path.basename(source.file, '.md');
  if (collection === 'competitions' && front.slug && front.slug !== expected) {
    issues.push(
      `"Slug" is "${front.slug}" but this page is registered as ${expected}.md. ` +
        `Set the Slug row to "${expected}", or change "file" in content-sources.json.`
    );
  }

  if (issues.length) {
    const shown = issues.slice(0, 6).map((i) => `    ${i}`);
    if (issues.length > shown.length) shown.push(`    …and ${issues.length - shown.length} more.`);
    problems.push(`${banner(source)}\n${shown.join('\n')}`);
    continue;
  }

  const markdown = toMarkdown(front, body, { collection, from: source.from });
  const current = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : null;
  if (current === markdown) {
    console.log(`unchanged  ${source.file}`);
    continue;
  }

  changed++;
  if (dryRun) {
    console.log(`would update  ${source.file}`);
    continue;
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, markdown);
  console.log(`updated  ${source.file}`);
}

if (problems.length) {
  console.error(`\nCould not sync ${problems.length} of ${sources.length}:\n`);
  for (const p of problems) console.error(`  ${p}\n`);
  process.exit(1);
}

console.log(`\n${changed} file(s) changed. Run npm run check next.`);
