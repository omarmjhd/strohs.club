# Reconciliation Register

Places where the 2026 Almanac and the site content in `content/` disagreed, plus content on the
site that had no Almanac source at all.

> **The 2026 Almanac has been retired.** The Almanac is now generated from `content/`
> (`public/downloads/strohs-almanac.pdf`) and is the only one. Page citations below refer to the
> old Google Doc export, kept because they are the audit trail for why the site says what it
> says; the file itself is recoverable from git history if a citation ever needs checking.

Agents working on this repo flag into this register rather than resolving conflicts on their own
— a wrong guess about a scoring rule or the season's charity is worse than an open question.
Omar and Josh rule on each item; the ruling then flows back into whichever side was wrong.

IDs are stable. Cite them (`R-02`, `D-05`) in commits and in content comments. The detail behind
each item is kept below even after it is ruled, because the register is the audit trail for why
the site says what it says.

---

## Rulings — 2026-08-04

Omar ruled on every open item. **The site won nearly every Almanac conflict**, so the corrections
below mostly belong in the Almanac, not in `content/`.

### Almanac vs. site

| ID | Ruling | Change |
|---|---|---|
| **R-01** | **Wonders and Worries** is the current charity | `about/charity.md` gained a "This season" section. The Almanac's *Kids Eat, Inc* is wrong |
| **R-02** | **150** — the site is right | none |
| **R-03** | **7 / 5 / 2** — the arithmetic wins over the printed table | none. Almanac p6's 7/5/3 is wrong |
| **R-04** | **Sunday, April 11 2027** — the site is right | none |
| **R-05** | **Sundays: May 2, May 16, Jun 13, Jun 27** — the site is right | none |
| **R-06** | **Must be a STROH** — the site's stricter wording is intended | none |
| **R-07** | **South** Texas Roost of Hospitality | none. The Almanac's "Southern" is wrong |
| **R-08** | Revert to **"January or February"** — the month is not settled | `two-step.md` × 3 (prose, `keyFacts.When`, `summary`) |
| **R-09** | **Late October / early November 2026**, as a target | `all-strohs-open.md` × 2 |
| **R-10** | **Golf Club** — the site is right | none |
| **R-11** | Almanac bug; the site's "four" is right | none |

### Draft ratification

| ID | Ruling | Held back as draft |
|---|---|---|
| **D-01** | Rules ratified — Day-2 pick-up, USGA 9-6-3-1 tie-break, Winner's Belt | Landa Park · $250 entry · 40-player cap · Google Form |
| **D-02** | Quota formula, Winner's Jacket, tie-breakers and Side Games all ratified | $125 entry fee only |
| **D-03** | Fully ratified | — |
| **D-04** | **Deleted** — "monthly recaps and the odd surprise prize" removed outright | — |
| **D-05** | **Texas Cup is real** — fully ratified, artifacts restored | — |

Winner's Belt was not explicitly ruled; it was ratified by analogy with the Jacket in `D-02`.

### Build-out questions

| ID | Ruling |
|---|---|
| **C-01** | Instagram handle confirmed as ours. No change |
| **C-03** | Home page renders only an excerpt of `getting-started`; the competitions table now appears on `/getting-started` only |
| **C-04** | Unblocked by the date rulings — the at-a-glance table gained a **When** column |
| **C-05** | Texas Cup added to `getting-started.md` and `path-to-nationals.md` as an explicitly non-qualifying team event |
| **C-06** | **#getinvolved**. `competition-notes.md` corrected |
| **C-07** | No action — informational, so nobody "fixes" the 2022 blockquote |
| **C-08** | Still deferred with standings |
| **C-09** | **Nest Invitational Tournament**. The Almanac's "NLU Invitational" is wrong; `path-to-nationals.md` and `two-step.md` corrected |
| **K-05** | Keep the compressed weather rule |

### Consequences for the Almanac

The Almanac PDF is now the out-of-date document. It needs correcting on **R-01** (charity),
**R-02** (walk-off 100 → 150), **R-03** (Alt-Shot 7/5/3 → 7/5/2), **R-07** (Southern → South),
**R-09** (ASO timing), **R-11** (says five qualifiers, lists four), and **C-09** (NIT expansion),
and it needs a Texas Cup section written for **D-05**.

### Still open

**Awaiting confirmation**

- **D-01 remainder** — the **$250 Two-Step entry fee** is the only content anywhere still held
  back from the artifacts. It renders on the website and is stripped from every PDF, PNG, deck
  and the Almanac. The venue is now TBD (Landa Park removed outright), and the 40-player cap and
  Google Form sign-up were ratified.

**Before DNS cutover — must not ship live**

- **Both standings boards show filler data.** The Muni Tour and Opn Szn sheets still hold
  placeholder rows from a previous season, so the site publishes a leader, a points race and a
  projected playoff bracket that mean nothing. Harmless while only Omar and Josh can reach the
  site; misleading the moment DNS moves. Point both at the new season's sheets, or hide the
  boards, before cutover.

### Closed by implementation

| ID | Resolution |
|---|---|
| **R-12** | Canonical hostname. Resolved by neither original option: `public/CNAME` is gone and the site is served from `omarmujahidpair.com/strohs.club/` until DNS moves, with `site` and `base` set to match. The www-vs-apex decision returns at cutover |
| **R-15** | Draft facts in frontmatter. `keyFacts` in `two-step.md` and `all-strohs-open.md` carry inline markers, and `site/content.config.mjs` strips markers from frontmatter strings — the site shows the prose, the pipeline drops it. Without that transform the markers rendered as visible escaped text in the Key Facts panel |
| **D-02** | ASO entry fee. Ratified as an estimate — "estimated at $125, $20 of which goes to the Side Games", with the final figure confirmed before sign-up opens. Nothing on that page is withheld any more |
| **C-02** | Discord posture. The public invite stays, but it and the Instagram URL moved into `site/lib/links.mjs`, and `build-all` now fails on any `discord.gg` or `instagram.com` URL in `content/` or `slides/` that does not match. Rotating the invite was previously eight edits with no signal if you missed one |
| **R-16** | Schema drift. `status`, `draftIds` and page-level `outputs` are now declared in both collections in `site/content.config.mjs`, so layouts can see draft state instead of having it silently stripped. `R-14`'s content-side workaround could now be done in the layout if wanted |
| **K-04** | `competition-notes` had no art. It now carries the parent STROH's badge and navy accent, so its header matches every other competition page |
| **Fonts** | Fraunces and Source Sans 3 are self-hosted in `public/fonts/` (latin subset, 244 KB). The document templates embed them as data URIs so rendering never touches the network; the site loads them from a path relative to the bundled stylesheet, which stays correct whatever `base` is |
| **C-08** | Standings publication. `content/standings.md` exists and boards render live from published sheets. Muni Tour (qualifiers, city standings, nine course boards) and Opn Szn (season points plus a projected bracket) are live; the Two-Step, ASO and Texas Cup appear automatically once each has a sheet |

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

### Where each of these lives now

`content/about.md` was split into an About section and a season page during the 2026 build-out,
so the file names in the table above are historical. Current locations and exact wording:

| ID | File and section today | Cost of the ruling |
|---|---|---|
| **R-01** | `content/about/charity.md` — names *Austin Firefighters Relief and Outreach Fund* and *Wonders and Worries* as **past** recipients only, and never states a current-season charity. The old `2026 Charity` quick fact was deliberately not carried over | One sentence added under "This season". Nothing else changes |
| **R-02** | `muni-tour.md` → "Mulligan Rounds". Almanac p9: the round "will count with a score of 100, replacing any prior score" | One number |
| **R-03** | `opnszn.md` → "Alt-Shot", and its `social.scoring` block | One number in two places. See the note below before ruling |
| **R-04** | `opnszn.md` → "Season & Playoffs" and `keyFacts.Season`. Almanac p5: "September 1st, 2026 until April 12th 2027" | One date in two places |
| **R-05** | `opnszn.md` → "Season & Playoffs" | Four dates |
| **R-06** | `muni-tour.md` → "Posting an Official Round", step 2 | One clause. See the note below |
| **R-07** | `content/about/what-is-a-roost.md`, `content/about/governing-principles.md`, plus site chrome: `site/layouts/Base.astro` (title, header, footer) and `site/pages/index.astro` (tagline) | One word × 6 |
| **R-08** | `two-step.md` → "When & Where", `keyFacts.When`, `summary` | One phrase × 3 |
| **R-09** | `all-strohs-open.md` → "Moving to the Fall", `keyFacts.When` | One phrase × 2 |
| **R-10** | `content/season/path-to-nationals.md` — "Sweetens Cove Golf **Club**" in prose, bare "Sweetens Cove" in quick facts | One word, if it matters |
| **R-11** | `path-to-nationals.md` and `getting-started.md` both say **four**, reproducing the Almanac's own list of four | Fix the Almanac, not the site |

**Before ruling `R-03`:** Almanac p6 states the bonus as "we will award all four players who play
an alt-shot match **2 points, regardless of the result**", then lists 7 / 5 / 3. The arithmetic
holds for two of the three — 5 + 2 = 7 and 3 + 2 = 5 — but 0 + 2 = 2, not 3. The site picked the
arithmetic. This needs a decision about intent, not a transcription check.

**Before ruling `R-06`:** the site's stricter wording also gates the Muni Tour / OpnSzn crossover.
A crossover match played against a non-STROHs Refugee satisfies the Almanac but not the page.

**`R-07`** was reproduced rather than corrected on purpose: `what-is-a-roost.md` carries the old
`about.md` wording verbatim, and the Almanac p1 lead-in restored into `governing-principles.md`
was written as "South" to match the prevailing site convention rather than introduce a third
variant on an adjacent page.

---

## Conflicts — inside the repo

Not Almanac-vs-content. Two parts of the repo that disagree with each other.

| ID | Topic | One side says | The other says | Severity |
|---|---|---|---|---|
| **R-12** | Canonical hostname | `astro.config.mjs`: `site: 'https://www.strohs.club'` — every canonical tag, sitemap URL, and absolute link Astro emits is **www** | `public/CNAME`: `strohs.club` — GitHub Pages will serve, and redirect to, the **apex** | **High** — the deployed site advertises a hostname other than the one it is served from |
| **R-15** | Draft facts in frontmatter | `<!-- draft:D-0n -->` markers wrap body prose only | the same unratified facts are also stated in `keyFacts`, `summary` and `social.scoring`, which are unmarked — so D-01's Landa Park / Winner's Belt / Day-2 pick-up and D-02's $125 entry / Winner's Jacket / `36 − course handicap` still print in the one-pager PDFs and the social PNGs | **High** — the artifacts the markers exist to protect still carry the unratified facts |
| **R-16** | Schema drift between the two readers of `content/` | `site/content.config.mjs` declares no `status`, `draftIds`, or page-level `outputs`, and `z.object` **strips** unknown keys instead of erroring | `scripts/lib/content.mjs` honours all three for every component | Medium — Astro cannot see draft state at all, and a page can opt into a PDF the site will never link |

### R-12 — either fix is one line, plus DNS

- **If apex is canonical** (what the deploy brief specifies): drop the `www.` from `site` in
  `astro.config.mjs`. DNS needs the four GitHub Pages A records on the apex
  (`185.199.108–111.153`, plus the AAAA equivalents) and a `www` CNAME to `omarmjhd.github.io`
  so the www→apex redirect works.
- **If www is canonical**: `public/CNAME` becomes `www.strohs.club`, and DNS is a single `www`
  CNAME to `omarmjhd.github.io` plus apex A records for the reverse redirect.

Picking the wrong one publishes mismatched canonical URLs to search engines for as long as it
stands. Whichever host the WordPress site being replaced currently serves is almost certainly
the one to keep.

### R-15 — the mechanism exists, no content uses it

`stripDrafts()` now runs over frontmatter strings as well as the body, using the same syntax:

```yaml
  - label: Where
    value: "<!-- draft:D-01 -->Landa Park Golf Course<!-- /draft:D-01 -->"
```

A value that is entirely draft-marked drops out; a `{label, value}` record that loses either
half is dropped whole, so no half-empty fact reaches a template. **No content file uses this
yet** — applying it is a content edit, and deciding *which* key facts are unratified is a ruling.
The candidates, from D-01 and D-02:

- `two-step.md` — `keyFacts` Where (Landa Park Golf Course) and The prize (Winner's Belt + NIT
  spot + Roost Regional team seat); `social.scoring` "Day 2: pick up once a hole can't beat your
  Day 1 score"; `summary` names Landa Park's window.
- `all-strohs-open.md` — `keyFacts` Entry ($125, "includes Side Games"), Prize (Winner's Jacket +
  Roost Regional berth), Quota target (`36 − course handicap`, min 9); the matching
  `social.scoring` lines; `summary` states $125, Side Games and the Jacket.
- `texas-cup.md` — all of it, but moot: `status: draft` already suppresses every artifact.

An alternative shape, if marking frontmatter reads badly: move these values out of frontmatter
and into the marked body until they are ratified.

### R-16 — why it matters

`z.object` silently discards keys it does not declare, so `texas-cup.md`'s `status: draft` and
`draftIds: [D-05]` validate cleanly and then vanish before any `.astro` file can read them. That
is why `R-14` below had to be fixed on the content side: the layout physically could not see the
draft flag. Adding the three fields to the schemas is a small change with one consequence worth
naming — layouts would then be able to gate on draft state, which is a different design from
"`outputs` is the single gate".

### Closed

| ID | Topic | Resolution |
|---|---|---|
| **R-13** | The `kind: notes` page would appear in the Standings dropdown as a sixth, meaningless link, because the dropdown is `competitions.map(...)` | **Closed.** "Leave Standings alone" read as "don't invest in standings": `site/components/Nav.astro` now filters the Standings array on `kind === 'competition'`, mirroring the home-page cards and the overview deck. The rendered dropdown is unchanged today — same five links, all `#`. Standings URLs remain deferred |
| **R-14** | `competitions/texas-cup.md` was `status: draft`, so the pipeline built no PDF and no PNG for it, but the file still declared `outputs: [page, pdf, png]` and `Competition.astro` renders the Documents panel off `outputs` alone — the page shipped two links to files that do not exist | **Closed.** `texas-cup.md` now declares `outputs: [page]`. Fixed on the content side rather than in the layout because of `R-16`. **Follow-up: restore `pdf, png` when the draft flag comes off** |

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

### How the marking is applied

Marker form is `<!-- draft:ID -->` / `<!-- /draft:ID -->`, each on its own line. The markers are
stripped from the rendered site by a remark plugin in `astro.config.mjs` and the prose between
them is dropped entirely by `scripts/lib/content.mjs` before any artifact is generated.

| ID | Blocks | What is wrapped |
|---|---|---|
| **D-01** | 5 | Winner's Belt bullet · Day-2 pick-up (twice: Ringer Format prose + The Rules) · Landa Park "Where" bullet · the whole Tie-Breaker + How to Enter run |
| **D-02** | 4 | `36 − handicap` blockquote · the whole Tie-Breaker section · Winner's Jacket + the whole Side Games section · the $125 paragraph |
| **D-03** | 2 | Discord-thread declaration + "scoring form" · the whole Tie-Breakers section |
| **D-04** | 1 | "monthly recaps and the odd surprise prize" |
| **D-05** | 1 + frontmatter | `status: draft` and `draftIds: [D-05]`, *and* the whole body wrapped. Belt-and-braces: `status: draft` alone already suppresses every artifact. Any draft manifest should de-duplicate by id |

Three editorial changes were needed to make the marking possible without also hiding sourced
material. All three preserve every fact:

- `two-step.md` "When & Where" — the venue was fused into the sourced date sentence ("…in January
  2027 at Landa Park Golf Course"). Landa Park now lives only in the wrapped `- **Where:**` bullet.
- `all-strohs-open.md` "Prizes & Qualifying" — the Winner's Jacket (draft) and the Roost Regional
  berth (sourced, p4) were one sentence; now two.
- `opnszn.md` — "monthly recaps and the odd surprise prize" appeared in both "How It Works" and
  "Season & Playoffs". The duplicate was collapsed rather than marked twice; the full phrase
  survives, marked, in "Season & Playoffs".

**Known cosmetic side effect:** in `two-step.md`, markers sitting between list items split one
`<ul>` into two adjacent lists on the rendered page.

---

## Open questions from the 2026 build-out

Raised while decomposing the Almanac into `content/`. None is an Almanac-vs-site conflict; each
is a question only Omar or Josh can answer.

### C-01 — `instagram.com/strohs_roost` has no source anywhere
It appears in neither the Almanac nor the old `content/about.md` — only in the site footer
(`site/layouts/Base.astro`). It has now been carried into `content/community.md` twice (a quick
fact and an "Elsewhere" section), so it is asserted in content, not just chrome. **Needs
confirmation that the handle is live and ours.** If it isn't: delete two lines from
`community.md` and one from the footer.

### C-02 — public Discord invite URL vs. the Almanac's invite-on-request
Almanac p9: "contact @jdonelson, @omarmjhdpr, or any other Stroh on the refuge (or directly) to
get an invite link" — invites are requested. The old `about.md` published a standing invite URL
(`discord.gg/frNSUn5ZmC`), which is also hard-coded in `site/pages/index.astro`.
`content/community.md` and `content/getting-started.md` now carry the public URL **and** the
ask-a-human path. Low severity, but it is a posture question: a permanent public invite link on
a public site is a different access policy from the one the Almanac describes.

### C-03 — `getting-started.md` renders on two pages, and the home page now doubles up
`site/pages/index.astro` renders the `getting-started` body inline, so its new content lands on
`/` as well as `/getting-started`. On the home page the new **Competitions at a Glance** table now
sits directly above the pre-existing competition card grid. Different information — format and
what it earns you, vs. logo and blurb — but adjacent, and nobody owned the visual judgement.
The "what we are in two lines" went into the `subtitle` frontmatter, which `Page.astro` renders
and `index.astro` does not, so the hero is not duplicated. Cheapest fixes if it reads badly: drop
the card grid from `index.astro`, or render only an excerpt of `<Content />` there.

### C-04 — the at-a-glance table has no "When" column, because all four dates are contested
`R-04`, `R-05`, `R-08` and `R-09` between them make every date that would go in the
`getting-started.md` competitions table an open question. Rather than pick a side four times in a
table skimmed by newcomers, the table has **What it is** and **What it earns you** only, and sends
readers to the competition pages. Ruling those four unlocks a `When` column; the table has room.

### C-05 — Texas Cup is on the home page but on neither page that enumerates competitions
Related to `D-05`. Texas Cup was left out of the `getting-started.md` at-a-glance table and the
`path-to-nationals.md` qualifier list on the narrow ground that **it is not a Roost Regional
qualifier** — true regardless of how `D-05` resolves. But `site/pages/index.astro` still says
"plus the Texas Cup for bragging rights". If `D-05` confirms the event, both pages should gain a
line placing it as a non-qualifying team event.

### C-06 — the hashtag is spelled two ways, and both are now on the site
Almanac p1 writes **#getinvolved**; p3 writes **#gettinginvolved**. Each page restored the
sentence it was restoring, so `content/about/governing-principles.md` now says `#getinvolved` and
`content/competitions/competition-notes.md` says `#gettinginvolved`. Trivial, but it is the org's
own hashtag and it should be spelled one way.

### C-07 — the 2022 blockquote's dates contradict the current championship window
The NLU crew blockquote (Almanac p2, reproduced verbatim in `path-to-nationals.md`) says the
Championship "will be held in Late August or September of 2022". Everywhere else — Almanac p1,
the old `about.md` — says late October at Sweetens Cove. **This is not a conflict**: the quote is
a 2022 founding document, and the page introduces it as such and follows it with a note that the
dates are 2022's while the team-of-four and Nest-member rules still govern. Flagged only so a
later reader doesn't "fix" the quote. The Almanac also carries a Google Doc link here
(`docs.google.com/document/d/17HET…`) that was not reproduced, on the assumption it isn't public.

### C-08 — the standings publication plan has no owner
Almanac p8 describes per-course and overall playoff-picture leaderboards, publicly available on
the STROH's website, with a Google Sheet in the interim. Its natural home is `content/standings.md`,
which was explicitly deferred, so it is still unported and will stay that way until standings are
picked back up. The Standings nav dropdown exists but every link is `#` (see `R-13`).

### C-09 — what "NIT" stands for
Three variants are in play and none agree:

- **The old `about.md`:** "**Nest** Invitational Tournament (NIT)" — the long-standing site wording.
- **The Almanac:** "**No Laying Up** Invitational Tournament (NIT)" (p1) and "NLU Invitational
  Tournament (NIT)" (p3). Self-consistent; never says "Nest".
- **What shipped:** `season/path-to-nationals.md` says "**NLU Invitational (NIT)**" and
  `competitions/two-step.md` says "an invitation to the **NLU Invitational**" — a third form that
  drops "Tournament", so the acronym no longer derives from the words it abbreviates.

Two questions: **(a)** Nest vs. No Laying Up — a real source conflict of the same shape as `R-07`,
and the site's prior wording was replaced without being logged at the time; **(b)** whether
"Tournament" belongs in the expansion, which is a transcription slip rather than a conflict.
Ruling (b) alone is a one-word edit in two files.

### K-04 — `competition-notes` has no art
No `hero`, `logo`, or `accent`. Nothing breaks: the PDF template falls back to `NAVY` and omits
the hero image. But the site hero block renders as a bare `<h1>`, and the page is the only
competition-collection entry without a badge.

### K-05 — Muni Tour weather handling is compressed to one line
Almanac p8/p9 draw a resume-vs-restart distinction and separate acts of god from life events.
`muni-tour.md` compresses all of it to "Weather or a genuine emergency voids the round". Either
the page should carry the full rule or the ruling should confirm the compression is intended.

---

## Almanac content not yet anywhere in `content/`

Not conflicts — gaps. Source material with no home on the site yet.

**Absorbed during the 2026 build-out** and no longer on this list: the 2022 NLU blockquote, the
Executive Committee detail in full, the competition philosophy line, teebox guidance, the
three-tier rule hierarchy, and the 9-shot max provenance (the last three now in
`content/competitions/competition-notes.md`).

**Still unported:**

- **The 2022 NLU crew blockquote's Google Doc link** (p2) — deliberately not reproduced; see `C-07`.
- **Muni Tour weather/act-of-god handling in full** (p8, p9): resume the same day vs. a full
  restart on another day; the player is not obliged to resume just because the course reopened;
  a *life event* mid-round voids the round entirely, which is distinct from weather. See `K-05`.
- **Ties split evenly** (p8) — "half, third, and quarter points are possible". `muni-tour.md`
  gives only the two-way example.
- **Muni Tour playoff logistics** (p9) — the competition committee picks a location amenable to
  all twelve, factoring travel time; the goal is to finish by the end of May.
- **OpnSzn Alt-Shot rationale** (p6) — the 2-point kicker also offsets losing the two Singles
  matches you could have played in a Fourball. `opnszn.md` gives only "Alt-Shot is a blast".
- **Standings publication plan** (p8) — see `C-08`. No owner.
- **Charity history** (p10): Austin Firefighters Relief & Outreach Fund and Wonders and Worries
  as past recipients; the charity doesn't change every year; open to suggestions. *(Now carried
  in `content/about/charity.md` — retained here until `R-01` is ruled.)*

Two other loose ends, neither an Almanac gap:

- `public/downloads/strohs-almanac.pdf` is built and shipped but **linked from nowhere**. A link
  belongs on a page or in the nav.
- `public/downloads/muni-tour-slides.html` is generated but linked from nowhere either; only
  `strohs-overview-slides.html` is referenced.

---

## ID map

Tracks working in parallel filed some findings under their own local IDs. Those were merged into
the register; the originals are listed here so older commit messages still resolve.

| Original | Now | Why |
|---|---|---|
| `K-01` | `R-15` | Same finding: draft markers don't reach frontmatter |
| `K-02` | `R-16` | Same root cause: `z.object` strips fields the node pipeline relies on |
| `K-03` | `R-13` | Same finding: the notes page in the Standings dropdown |
| `K-06` | `R-14` | `K-06` recorded the fix for `R-14`; both are the same closed item |

`R-12` (T2), `R-13` (T1) and `R-14`–`R-16` (T5) were proposed by their tracks and kept as filed.
`C-01`–`C-09` and `K-04`–`K-05` keep their original IDs.
