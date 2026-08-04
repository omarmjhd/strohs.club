export const NAVY = '#002060';
export const CRIMSON = '#C00840';
export const CREAM = '#F8E8B8';
export const INK = '#1A1A2E';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Fonts are embedded rather than linked. The PDF/PNG scripts render with `networkidle0`, so a
// slow or blocked fonts.googleapis.com would not fail the build — it would silently emit
// artifacts in a fallback face.
const FONT_DIR = path.resolve(fileURLToPath(import.meta.url), '../../public/fonts');
const face = (family, weight, file) =>
  `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};font-display:block;` +
  `src:url(data:font/woff2;base64,${fs.readFileSync(path.join(FONT_DIR, file)).toString('base64')}) format('woff2');}`;

export const FONTS =
  '<style>' +
  face('Fraunces', 500, 'fraunces-500.woff2') +
  face('Fraunces', 600, 'fraunces-600.woff2') +
  face('Source Sans 3', 400, 'source-sans-3-400.woff2') +
  face('Source Sans 3', 600, 'source-sans-3-600.woff2') +
  face('Source Sans 3', 700, 'source-sans-3-700.woff2') +
  face('Source Sans 3', 900, 'source-sans-3-900.woff2') +
  '</style>';

export const rootVars = (accent = NAVY) =>
  `:root{--navy:${NAVY};--crimson:${CRIMSON};--cream:${CREAM};--ink:${INK};--accent:${accent};}`;

// Markdown bodies contain raw HTML that reuses the site's class names (.panel, .fact,
// .facts-stack), so every print template has to define them itself.
export const PROSE_PRINT_CSS = `
  .facts{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:12px 0}
  .fact{background:#Eef1f8;border-radius:7px;padding:8px 11px}
  .fact .l{display:block;font-size:8.5pt;text-transform:uppercase;letter-spacing:.05em;color:var(--accent);font-weight:700}
  .fact .v{font-weight:600;color:var(--navy)}
  .summary{background:#F6F0FB;border-left:5px solid var(--accent);border-radius:6px;padding:10px 14px;margin:12px 0;color:#3a2a52}
  h2{font-family:"Fraunces",Georgia,serif;color:var(--navy);font-size:14pt;margin:16px 0 6px;border-bottom:2px solid #E9EDF5;padding-bottom:3px}
  h3{color:var(--crimson);font-size:12pt;margin:12px 0 4px}
  table{border-collapse:collapse;width:100%;margin:10px 0;font-size:10.5pt}
  th{background:var(--navy);color:#fff;text-align:left;padding:6px 9px}
  td{padding:5px 9px;border-bottom:1px solid #ececf2}
  ul,ol{margin:6px 0;padding-left:20px}li{margin:3px 0}
  strong{color:var(--navy)}
  .panel{border:1px solid #e6e6ee;border-radius:8px;padding:10px 12px;background:#fbfbfd}
  .panel h4{text-transform:uppercase;letter-spacing:.05em;color:var(--accent);font-weight:800;font-size:9pt;margin:0 0 6px}
  .facts-stack{display:flex;flex-direction:column;gap:6px}
  .fact-label{display:block;font-size:8.5pt;text-transform:uppercase;letter-spacing:.05em;color:var(--accent);font-weight:700}
  .fact-value{font-weight:600;color:var(--navy)}`;

export const facts = (data) =>
  (data.keyFacts || [])
    .map(
      (f) =>
        `<div class="fact"><span class="l">${f.label}</span><span class="v">${f.value}</span></div>`
    )
    .join('');
