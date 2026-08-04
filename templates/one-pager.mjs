import { FONTS, NAVY, PROSE_PRINT_CSS, facts, rootVars } from './brand.mjs';

export function onePagerHTML({ data, bodyHtml, badge, hero }) {
  const accent = data.accent || NAVY;
  return `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>
  ${rootVars(accent)}
  *{box-sizing:border-box}
  body{font-family:"Source Sans 3",-apple-system,Helvetica,Arial,sans-serif;color:var(--ink);font-size:11.5pt;line-height:1.5;margin:0}
  .head{display:flex;align-items:center;gap:14px;border-bottom:3px solid var(--accent);padding-bottom:10px;margin-bottom:14px}
  .head img{height:52px}
  .head .t{font-family:"Fraunces",Georgia,serif;font-weight:600}
  .head .t .title{color:var(--navy);font-size:22pt;line-height:1}
  .head .t .tag{color:#555;font-size:11.5pt}
  .head .hero{margin-left:auto;max-height:60px}${PROSE_PRINT_CSS}
  .foot{margin-top:16px;border-top:1px solid #e6e6ea;padding-top:8px;color:#888;font-size:9pt}
  </style></head><body>
    <div class="head">
      <img src="${badge}" alt="STROH's">
      <div class="t"><div class="title">${data.title}</div><div class="tag">${data.tagline || ''}</div></div>
      ${hero ? `<img class="hero" src="${hero}" alt="">` : ''}
    </div>
    ${data.keyFacts ? `<div class="facts">${facts(data)}</div>` : ''}
    ${data.summary ? `<div class="summary">${data.summary}</div>` : ''}
    ${bodyHtml}
    <div class="foot">STROH's — South Texas Roost of Hospitality · strohs.club</div>
  </body></html>`;
}
