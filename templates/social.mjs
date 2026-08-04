import { CREAM, CRIMSON, FONTS, NAVY, facts } from './brand.mjs';

const scoringList = (social) => (social.scoring || []).map((s) => `<li>${s}</li>`).join('');

const coursesCols = (social) =>
  (social.courses || [])
    .map(
      (c) =>
        `<div class="city"><div class="cname">${c.city}</div><ul>${(c.list || [])
          .map((n) => `<li>${n}</li>`)
          .join('')}</ul></div>`
    )
    .join('');

const slimFacts = (data) => {
  const all = data.keyFacts || [];
  const preferred = all.filter((f) => /season|prize/i.test(f.label));
  const picked = (preferred.length ? preferred : all).slice(0, 2);
  return picked
    .map(
      (f) =>
        `<div class="fact"><span class="l">${f.label}</span><span class="v">${f.value}</span></div>`
    )
    .join('');
};

export function socialHTML({ data, badge }) {
  const accent = data.accent || NAVY;
  const accent2 = data.accent2 || accent;
  const social = data.social;

  const richBody = social
    ? `
      ${social.scoring ? `<div class="section"><div class="sh">How It Works</div><ul class="scoring">${scoringList(social)}</ul></div>` : ''}
      ${social.courses ? `<div class="section"><div class="sh">The Courses</div><div class="cities">${coursesCols(social)}</div></div>` : ''}
      ${data.keyFacts ? `<div class="strip">${slimFacts(data)}</div>` : ''}`
    : `
      ${data.summary ? `<div class="summary">${data.summary}</div>` : ''}
      <div class="facts">${facts(data)}</div>`;

  return `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>
  :root{--navy:${NAVY};--accent:${accent};--accent2:${accent2};--crimson:${CRIMSON};--cream:${CREAM};}
  *{box-sizing:border-box}
  html,body{margin:0;padding:0}
  body{width:1080px;height:1350px;font-family:"Source Sans 3",Helvetica,Arial,sans-serif;color:#1A1A2E;background:#ffffff;overflow:hidden;position:relative}
  .band{background:var(--navy);height:300px;padding:40px 48px;display:flex;flex-direction:column;justify-content:center;border-bottom:9px solid var(--accent)}
  .band .row{display:flex;align-items:center;gap:22px}
  .band img{height:88px}
  .band .kicker{color:var(--cream);font-weight:700;letter-spacing:.14em;text-transform:uppercase;font-size:22px}
  .band h1{font-family:"Fraunces",Georgia,serif;color:#fff;font-size:72px;margin:6px 0 0;line-height:1}
  .body{padding:34px 48px 100px}
  .tag{font-size:30px;color:#333;line-height:1.25;margin:0 0 24px}
  .section{margin-bottom:26px}
  .sh{font-family:"Fraunces",Georgia,serif;color:var(--crimson);font-weight:600;font-size:30px;letter-spacing:.02em;text-transform:uppercase;margin-bottom:12px;padding-bottom:6px;border-bottom:3px solid #E9EDF5}
  ul{margin:0;padding:0;list-style:none}
  .scoring li{position:relative;font-size:26px;line-height:1.35;color:#222;padding:6px 0 6px 34px}
  .scoring li:before{content:"";position:absolute;left:6px;top:16px;width:12px;height:12px;border-radius:50%;background:var(--accent)}
  .cities{display:grid;grid-template-columns:1fr 1fr 1fr;gap:18px}
  .city{background:#Eef1f8;border-radius:12px;padding:18px 18px;border-top:6px solid var(--accent2)}
  .city .cname{font-weight:800;color:var(--navy);text-transform:uppercase;letter-spacing:.04em;font-size:21px;margin-bottom:10px}
  .city ul li{font-size:23px;color:#333;line-height:1.3;padding:4px 0}
  .strip{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:26px}
  .fact{background:#Eef1f8;border-radius:12px;padding:18px 20px}
  .fact .l{display:block;text-transform:uppercase;letter-spacing:.05em;color:var(--accent);font-weight:800;font-size:18px}
  .fact .v{font-weight:700;color:var(--navy);font-size:25px;line-height:1.2}
  .summary{font-size:27px;color:#222;line-height:1.4;background:#F4F1FA;border-left:10px solid var(--accent2);padding:22px 26px;border-radius:10px;margin-bottom:30px}
  .facts{display:grid;grid-template-columns:1fr 1fr;gap:18px}
  .facts .fact .v{font-size:26px}
  .foot{position:absolute;bottom:0;left:0;right:0;background:var(--accent);color:#fff;font-weight:700;text-align:center;padding:22px;font-size:28px;letter-spacing:.03em}
  </style></head><body>
    <div class="band"><div class="row"><img src="${badge}" alt=""><div><div class="kicker">STROH's Competition</div><h1>${data.title}</h1></div></div></div>
    <div class="body">
      <p class="tag">${data.tagline || ''}</p>${richBody}
    </div>
    <div class="foot">strohs.club · #getinvolved</div>
  </body></html>`;
}
