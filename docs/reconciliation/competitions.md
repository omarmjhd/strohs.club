# Reconciliation shard — T4 (competition rules)

Items for the barrier agent to fold into `docs/RECONCILIATION.md`. Register IDs `R-01`..`R-11`
and `D-01`..`D-05` are reused as-is. New items are proposed as `K-01`..`K-05`; `R-12` (T2) and
`R-13` (T1) are already claimed, so renumber the `K-` block into the `R-` sequence if the barrier
prefers a single namespace.

Almanac page numbers below are the PDF's own page numbers, verified against
`docs/2026-strohs-almanac.pdf` pages 3–9.

---

## Conflicts left untouched — confirmed, not resolved

Every value below still reads on the site exactly as it did before this track ran.

| ID | File | Site says (unchanged) | Almanac says | Cite |
|---|---|---|---|---|
| **R-02** | `muni-tour.md` → "Mulligan Rounds" | walking off under your own power posts as **150** | the round "will count with a score of **100**, replacing any prior score" | p9 |
| **R-03** | `opnszn.md` → "Alt-Shot", and `social.scoring` | **7 / 5 / 2** ("0 base + 2 bonus") | **7 / 5 / 3** for win / draw / loss | p6 |
| **R-04** | `opnszn.md` → "Season & Playoffs", `keyFacts.Season` | Regular Season ends **Sunday, April 11, 2027** | "September 1st, 2026 until **April 12th 2027**" | p5 |
| **R-05** | `opnszn.md` → "Season & Playoffs" | **Sun May 2 · Sun May 16 · Sun Jun 13 · Sun Jun 27**, 2027 | **05/03 · 05/17 · 06/14 · 06/28** | p5 |
| **R-06** | `muni-tour.md` → "Posting an Official Round" step 2 | "Play with **at least one other STROH** to attest" | "Play with another **Refugee** (STROHs member preferred but not required)" | p8 |
| **R-08** | `two-step.md` → "When & Where", `keyFacts.When`, `summary` | "a **Friday–Saturday in January 2027** (exact dates TBD)" | "We generally try and run this event in **January or February**" | p4 |
| **R-09** | `all-strohs-open.md` → "Moving to the Fall", `keyFacts.When` | **November 2026** (exact date TBD) | "ASO will move to **the Fall**" — no month given | p5 |

Two notes for whoever rules on these:

- **R-03** — p6 states the bonus as "we will award all four players who play an alt-shot match
  **2 points, regardless of the result**", then lists 7 / 5 / 3. 5 + 2 = 7 and 3 + 2 = 5 hold, but
  0 + 2 = 2, not 3. The Almanac is internally inconsistent; the site picked the arithmetic. Still
  needs an authoritative ruling rather than a pick.
- **R-06** — the site's stricter wording now also gates the Muni Tour / OpnSzn crossover, since a
  crossover match played against a non-STROH Refugee would satisfy the Almanac but not the page.

`R-01` and `R-07` also surface inside `content/competitions/` wording indirectly (the Roost's name
appears in the PDF template footer, not in these files) — no action taken here.

---

## Draft marking — what was applied

Marker form is `<!-- draft:ID -->` / `<!-- /draft:ID -->`, each on its own line, matching the
stripper now in `scripts/lib/content.mjs`. Verified balanced and alone-on-line for all six files.

| ID | File | Blocks | Notes |
|---|---|---|---|
| **D-01** | `two-step.md` | 5 | Winner's Belt bullet · Day-2 pick-up (twice: Ringer Format prose + The Rules) · Landa Park "Where" bullet · the whole Tie-Breaker + How to Enter run |
| **D-02** | `all-strohs-open.md` | 4 | `36 − handicap` blockquote · the whole Tie-Breaker section · Winner's Jacket + the whole Side Games section · the $125 paragraph |
| **D-03** | `muni-tour.md` | 2 | Discord-thread declaration + "scoring form" · the whole Tie-Breakers section |
| **D-04** | `opnszn.md` | 1 | "monthly recaps and the odd surprise prize" |
| **D-05** | `texas-cup.md` | 1 + frontmatter | **Both** mechanisms, per brief |

**`texas-cup.md` uses both approaches.** Frontmatter carries `status: draft` and
`draftIds: [D-05]`, and the entire body is additionally wrapped in one `D-05` marker pair. The
consequence for T5: `loadComponent()` reports `drafts: [{id:'D-05',whole:true},{id:'D-05',chars:1757}]`
— the same ID twice — and `isDraft` already suppresses every artifact, so the body wrap is
redundant belt-and-braces. If a draft manifest is generated, de-duplicate by id.

Two prose rewrites were needed to make marking possible without stripping sourced material; both
preserve every fact, only re-splitting sentences:

- `two-step.md` "When & Where" — the venue was fused into the sourced date/rationale sentence
  ("…in January 2027 at Landa Park Golf Course"). Landa Park now lives only in the wrapped
  `- **Where:**` bullet.
- `all-strohs-open.md` "Prizes & Qualifying" — the Winner's Jacket (draft) and the Roost Regional
  berth (sourced, p4) were one sentence; now two.

One duplicate was collapsed rather than double-marked: `opnszn.md` stated "monthly recaps and the
odd surprise prize" in both "How It Works" and "Season & Playoffs". The bullet now ends at
"Points accumulate across the whole **regular season**." and the full phrase survives, marked,
in "Season & Playoffs".

---

## New items

| ID | Topic | Detail | Severity |
|---|---|---|---|
| **K-01** | Draft material in frontmatter is unreachable by the stripper | `stripDrafts()` runs on the body only. `keyFacts`, `summary`, and `social.scoring` still carry D-01/D-02 material into every PDF and PNG | **High** |
| **K-02** | `status` / `draftIds` are not in the competitions schema | `site/content.config.mjs` uses `z.object`, which *strips* unknown keys rather than erroring — so `texas-cup.md` validates, but Astro cannot see its draft state | Medium |
| **K-03** | The notes page will appear in the Standings dropdown | Same surface as R-13; noting it from the content side because `competition-notes` is the entry that triggers it | Low (R-13 says closed) |
| **K-04** | `competition-notes` has no art | No `hero`, `logo`, or `accent`. The PDF template falls back to `NAVY` and omits the hero image, so nothing breaks; the site hero block renders as a bare `<h1>` | Low |
| **K-05** | Muni Tour weather handling on the site is a one-liner | p8/p9 draw a resume-vs-restart distinction and separate acts of god from life events; `muni-tour.md` compresses all of it to "Weather or a genuine emergency voids the round" | Medium |
| **K-06** | `texas-cup.md` now declares `outputs: [page]` | Barrier fix for R-14 — it shipped `[page, pdf, png]` while `status: draft`, so the built page carried two 404 download links. **Restore `pdf, png` when the draft flag comes off** | Closed, with a follow-up |

### K-01 — the specific fields still carrying draft content

Left alone because a frontmatter-level exclusion mechanism does not exist yet, and inventing one
here would collide with T5's stripper.

- `two-step.md` — `keyFacts`: "Where: Landa Park Golf Course", "The prize: Winner's Belt + NIT spot
  + Roost Regional team seat" · `social.scoring`: "Day 2: pick up once a hole can't beat your Day 1
  score"
- `all-strohs-open.md` — `keyFacts`: "$125 (general) — includes Side Games", "Winner's Jacket +
  Roost Regional berth", "Quota target: 36 − course handicap (min 9)" · `summary`: "$125", "Side
  Games", "Winner's Jacket" · `social.scoring`: "Your quota = 36 − course handicap"
- `texas-cup.md` — all of it, but moot: `status: draft` suppresses the artifacts entirely.

A workable shape, if the barrier wants one: a `draftFields: [keyFacts.2, summary]` list, or simply
moving these values out of frontmatter and into the marked body until they are ratified.

### K-05 — Almanac material still not on any page

Sourced content read during this track that has no home in `content/competitions/` and was not in
scope to add:

- **Muni Tour weather/act-of-god handling in full** (p8, p9) — resume same day vs. full restart on
  another day; the player is not obliged to resume just because the course reopened; a *life event*
  mid-round voids the round entirely, distinct from weather.
- **Ties split evenly** (p8) — "half, third, and quarter points are possible". `muni-tour.md` gives
  only the T2 example.
- **Standings publication plan** (p8) — per-course and overall playoff-picture leaderboards, public,
  on the site, Google Sheet in the interim.
- **Muni Tour playoff logistics** (p9) — the competition committee picks a location amenable to all
  twelve, factoring travel time; goal is to finish by the end of May.
- **OpnSzn Alt-Shot rationale** (p6) — the 2-point kicker also offsets losing the two Singles
  matches you could have played in a Fourball. `opnszn.md` gives only "Alt-Shot is a blast".
