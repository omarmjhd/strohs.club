import { CREAM, CRIMSON, FONTS, NAVY, PROSE_PRINT_CSS, facts, rootVars } from './brand.mjs';

const anchor = (slug) => `c-${slug}`;

const tocSection = ({ group, entries }) =>
  `${group ? `<div class="toc-group">${group}</div>` : ''}<ul class="toc-list">${entries
    .map(
      (e) =>
        `<li><a href="#${anchor(e.slug)}">${e.data.title}</a>${
          e.data.tagline ? `<span class="toc-tag">${e.data.tagline}</span>` : ''
        }</li>`
    )
    .join('')}</ul>`;

const component = ({ slug, data, bodyHtml }, group) => `
  <section class="component" style="--accent:${data.accent || NAVY}">
    <div class="kicker">${group || "STROH's"}</div>
    <h1 id="${anchor(slug)}">${data.title}</h1>
    ${data.tagline || data.subtitle ? `<p class="tagline">${data.tagline || data.subtitle}</p>` : ''}
    ${(data.keyFacts || []).length ? `<div class="facts">${facts(data)}</div>` : ''}
    ${data.summary ? `<div class="summary">${data.summary}</div>` : ''}
    ${bodyHtml}
  </section>`;

// Draft passages are listed by reconciliation ID only — reproducing them here would put
// the unratified text straight back into the artifact it was stripped from.
const appendix = (omissions) => `
  <section class="component appendix">
    <div class="kicker">Appendix</div>
    <h1>Omitted as Unratified</h1>
    <p class="tagline">Material on the website with no Almanac source, held back from this
    document until it is ruled on. Each ID is described in <em>docs/RECONCILIATION.md</em>.</p>
    ${
      omissions.length
        ? `<table><thead><tr><th>ID</th><th>Component</th><th>Omitted</th></tr></thead><tbody>${omissions
            .map(
              (o) =>
                `<tr><td><strong>${o.id}</strong></td><td>${o.title}</td><td>${
                  o.whole ? 'the entire component' : `${o.count} passage${o.count === 1 ? '' : 's'}`
                }</td></tr>`
            )
            .join('')}</tbody></table>`
        : '<p>Nothing was withheld from this edition.</p>'
    }
  </section>`;

export function almanacHTML({ sections, badge, omissions = [], generated }) {
  return `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>
  ${rootVars()}
  *{box-sizing:border-box}
  body{font-family:"Source Sans 3",-apple-system,Helvetica,Arial,sans-serif;color:var(--ink);background:#fff;font-size:11pt;line-height:1.5;margin:0}
  .cover{height:9.1in;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:var(--navy);color:#fff;margin:-0.5in -0.55in 0}
  .cover img{height:150px;margin-bottom:24px}
  .cover h1{font-family:"Fraunces",Georgia,serif;font-size:44pt;line-height:1;margin:0;color:#fff;border:0}
  .cover .sub{color:${CREAM};font-size:15pt;margin-top:14px;letter-spacing:.04em}
  .cover .rule{width:120px;border-top:4px solid ${CRIMSON};margin:26px 0}
  .cover .meta{color:#c8d0e4;font-size:10pt}
  .toc{page-break-before:always}
  .toc h1{margin-top:0}
  .toc-group{font-family:"Fraunces",Georgia,serif;color:var(--crimson);font-size:12pt;text-transform:uppercase;letter-spacing:.06em;margin:18px 0 6px}
  .toc-list{list-style:none;margin:0;padding:0}
  .toc-list li{border-bottom:1px dotted #d8dce8;padding:5px 0}
  .toc-list a{color:var(--navy);font-weight:600;text-decoration:none}
  .toc-tag{display:block;color:#666;font-size:9.5pt}
  .component{page-break-before:always}
  .kicker{color:var(--accent);font-weight:700;font-size:9pt;text-transform:uppercase;letter-spacing:.1em}
  h1{font-family:"Fraunces",Georgia,serif;color:var(--navy);font-size:26pt;line-height:1.05;margin:2px 0 6px;border-bottom:3px solid var(--accent);padding-bottom:8px}
  .tagline{color:#555;font-size:12pt;margin:0 0 10px}${PROSE_PRINT_CSS}
  </style></head><body>
    <div class="cover">
      <img src="${badge}" alt="STROH's">
      <h1>The STROH's Almanac</h1>
      <div class="rule"></div>
      <div class="sub">Every competition, every page, in one document</div>
      <div class="meta">Compiled ${generated} · strohs.club</div>
    </div>
    <section class="toc">
      <h1>Contents</h1>
      ${sections.map(tocSection).join('')}
    </section>
    ${sections
      .map((s) => s.entries.map((entry) => component(entry, s.group)).join(''))
      .join('')}
    ${appendix(omissions)}
  </body></html>`;
}
