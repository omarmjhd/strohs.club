# Reconciliation Register

Places where the 2026 Almanac (`docs/2026-strohs-almanac.pdf`) and the site content in
`content/` disagree, plus content on the site that has no Almanac source at all.

**Nothing here has been decided.** Agents working on this repo flag into this register rather
than resolving conflicts on their own — a wrong guess about a scoring rule or the season's
charity is worse than an open question. Omar and Josh rule on each item; the ruling then flows
back into whichever side was wrong.

IDs are stable. Cite them (`R-02`, `D-05`) in commits and in content comments.

---

## Conflicts — Almanac vs. `content/`

| ID | Topic | Almanac says | `content/` says | Severity |
|---|---|---|---|---|
| **R-01** | 2026 charity | p10: "In 2026, we've designated **Kids Eat, Inc**"; lists Wonders and Worries as a *past* charity | `about.md`: "the charity **returns to Wonders and Worries**"; also a front-page quick fact | **High** — directly reversed, and publicly visible |
| **R-02** | Muni Tour walk-off score | p9: leaving early under your own power posts as **100** | `muni-tour.md`: posts as **150** | **High** — scoring rule |
| **R-03** | Alt-Shot loss points | p6: **7 / 5 / 3** | `opnszn.md`: **7 / 5 / 2** | **High** — scoring rule. Note the Almanac is internally inconsistent: 7/5/3 cannot come from a uniform +2 bonus on 5/3/0. Someone reverse-engineered 7/5/2. Needs an authoritative ruling, not a pick |
| **R-04** | OpnSzn regular season ends | p5: **April 12, 2027** | `opnszn.md`: **Sunday, April 11, 2027** | Medium — Apr 11 *is* the Sunday; looks like a deliberate but undocumented fix |
| **R-05** | OpnSzn playoff deadlines | p5: 05/03, 05/17, 06/14, 06/28 | `opnszn.md`: Sun May 2, Sun May 16, Sun Jun 13, Sun Jun 27 | Medium — all four shifted a day to land on Sundays |
| **R-06** | Muni Tour playing partners | p8: play with another **Refugee** — STROHs member *preferred but not required* | `muni-tour.md`: "at least one other **STROH**" | Medium — the site is stricter than the rule |
| **R-07** | The Roost's name | Throughout: **Southern** Texas Roost of Hospitality | **South** Texas Roost of Hospitality — site header, footer, deck, meta description | Low but pervasive — it's the org's own name |
| **R-08** | Two-Step window | p4: "generally in **January or February**" | `two-step.md`: "a Friday–Saturday in **January 2027**" | Low — narrowed without stated authority |
| **R-09** | ASO timing | p5: "will move to **the Fall**", no month | `all-strohs-open.md`: **November 2026** (exact date TBD) | Low — invented specificity |
| **R-10** | Sweetens Cove | p1 "Golf **Course**", p2 "Golf **Club**" — the Almanac disagrees with itself | "Golf Club" | Trivial |
| **R-11** | Qualifier count | p1: "Our **five** qualifiers will come from:" then lists **four** | Consistently four | Almanac bug; the site is right |

---

## Draft content — on the site, no Almanac source

Confirmed as draft: written to fill out the pages, not yet ratified. Kept out of generated
artifacts (PDF, PNG, slides, Almanac) until confirmed, while still rendering on the website.

| ID | File | Unsourced material |
|---|---|---|
| **D-01** | `competitions/two-step.md` | Landa Park venue · $250 entry · 40-player field cap · Winner's Belt · the Day-2 pick-up rule · USGA 9-6-3-1 tie-break · Google Form sign-up |
| **D-02** | `competitions/all-strohs-open.md` | The quota formula `36 − course handicap` (the Almanac gives only the points table and the floor of 9) · $125 entry · Winner's Jacket · the 3-tier tie-breaker · the entire Side Games section |
| **D-03** | `competitions/muni-tour.md` | Tie-breaker ladder (head-to-head → countback → most recent) · declaring in the Discord thread with everyone's handicap · "scoring form" rather than the Almanac's scoring coordinator |
| **D-04** | `competitions/opnszn.md` | "Monthly recaps and the odd surprise prize" |
| **D-05** | `competitions/texas-cup.md` | The entire page. Texas Cup appears nowhere in the Almanac, and the north-star plan's file list omits it. Either the plan needs updating or the Almanac does |

---

## Almanac content not yet anywhere in `content/`

Not conflicts — gaps. Source material with no home on the site yet.

- **Teebox guidance** (p4): men 6100–6700 yds; women and 60+ 5500–6200. Appears nowhere.
- **The three-tier rule hierarchy** (p4): USGA ← local course rules ← tournament-specific STROHs
  rules; in match play, agreement of all players overrides any rule.
- **9-shot max provenance** (p4) — modeled on Texas UIL golf rules.
- **The 2022 NLU crew blockquote** (p2, ~130 words): the Little League World Series model, 10
  regions, Nest-member eligibility. The only real explanation of how the structure works.
- **Executive Committee detail** (p3): the fixed-alternates-list history, the "ask runners-up
  from other events" fallback, and the entire NIT naming rule (7 days, need not be the winner,
  irrevocable once named).
- **Competition philosophy** (p3): "prioritize fun courses, fun formats, and fun side games over
  pure stroke-play competition."
- **Muni Tour weather/act-of-god handling in full** (p8) — the resume-vs-restart distinction.
- **Ties split evenly** (p8) — half, third, and quarter points are all possible.
- **Standings publication plan** (p8): per-course and overall playoff-picture leaderboards,
  public, on the site, Google Sheet in the interim.
- **Charity history** (p10): Austin Firefighters Relief & Outreach Fund and Wonders and Worries
  as past recipients; the charity doesn't change every year; open to suggestions.
