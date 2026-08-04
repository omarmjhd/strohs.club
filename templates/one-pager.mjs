import { CREAM, CRIMSON, FONTS, INK, NAVY, facts } from './brand.mjs';

export function onePagerHTML({ data, bodyHtml, badge, hero }) {
  const accent = data.accent || NAVY;
  return `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>
  :root{--navy:${NAVY};--crimson:${CRIMSON};--cream:${CREAM};--ink:${INK};--accent:${accent};}
  *{box-sizing:border-box}
  body{font-family:"Source Sans 3",-apple-system,Helvetica,Arial,sans-serif;color:var(--ink);font-size:11.5pt;line-height:1.5;margin:0}
  .head{display:flex;align-items:center;gap:14px;border-bottom:3px solid var(--accent);padding-bottom:10px;margin-bottom:14px}
  .head img{height:52px}
  .head .t{font-family:"Fraunces",Georgia,serif;font-weight:600}
  .head .t .title{color:var(--navy);font-size:22pt;line-height:1}
  .head .t .tag{color:#555;font-size:11.5pt}
  .head .hero{margin-left:auto;max-height:60px}
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
  .fact-value{font-weight:600;color:var(--navy)}
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
