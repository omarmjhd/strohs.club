# STROH's Information Architecture & Communications Overhaul — Plan

## Context

STROH's (Southern Texas Roost of Hospitality) is an NLU Refuge golf Roost across Austin,
Houston, and San Antonio. Omar (Czar) and Josh are refreshing the org's communications, web
presence, information storage, and new-player onboarding. Today the info lives in a dense
10-page **Almanac** (Google Doc) and a **WordPress** site (`strohs.club`) organized as a
year-by-year *results archive*. That structure is comprehensive but overwhelming for newcomers
and hard to keep current.

**Goals for this initiative:**
1. **Re-architect the website** so pages are built from markdown files — one page per major and
   minor component of STROH's — on a modern, free, low-maintenance stack.
2. **Generate visual documents for each component** (easy to store + share).
3. **Create an approachable new-player introduction** that isn't overwhelming.

**Guiding reframe:** move from *"results archive by year"* → *"component-first, evergreen"*:
a durable page per thing STROH's *is*, with results/history hanging off it.

---

## The core architecture: one markdown file → five outputs

Every component is a single markdown file (the **source of truth**). CI renders it into:

```
content/<component>.md ──► Website page (Astro)
          (one file)   ──► One-page PDF (branded, printable/shareable)
                        ──► Social PNG (Instagram / Discord)
                        ──► Slide deck (Marp)
   all components, in order ──► Compiled Almanac (one long PDF + a web page)
```

Edit the `.md` once → site, one-pager, social image, deck, and the Almanac all update.

### Stack (decided)
| Layer | Choice |
|---|---|
| Repo | **GitHub** (`content/` = one `.md` per component) |
| Website | **Astro** static site |
| Slide decks | **Marp** (markdown → HTML/PDF/PPTX) |
| PDF + PNG | Headless **Chromium (Playwright)** rendering branded HTML templates (reuses the Muni Tour PDF pipeline; screenshots the same templates for PNGs) |
| CI/CD | **GitHub Actions** — build site + all artifacts on push, deploy, publish downloads |
| Hosting | **GitHub Pages** (free) + `strohs.club` custom domain (retire WordPress) |
| Live standings (v1) | **Embed published Google Sheets** on the relevant pages |

### Why the pipeline (vs. a "simple markdown host")
A simple host (Jekyll/Netlify theme) only makes web pages — it cannot produce PDFs, PNGs, decks,
or a compiled Almanac. Those outputs require a real build (Astro + CI). The trade the team liked
— *simple day-to-day authoring* — is preserved: contributors only ever "edit a markdown file and
push"; all complexity lives once in CI config we rarely reopen.

---

## Repo structure

```
strohs-club/
  content/
    getting-started.md          # the new-player front door
    about/
      what-is-a-roost.md
      governing-principles.md
      executive-committee.md
      charity.md
    season/
      path-to-nationals.md       # Texahoma region, Regionals, Championship, NIT, alternates
      calendar.md
    competitions/
      texas-two-step.md          # the Major / NIT qualifier
      all-strohs-open.md
      opnszn.md
      muni-tour.md
      competition-notes.md       # shared rules: teeboxes, handicaps, rule hierarchy, 9-shot max
    community.md                 # Discord + #find-a-game, Instagram, writeups
    standings.md                 # embeds of published sheets
  templates/                     # branded HTML/CSS for PDF one-pagers, PNGs, Almanac
  slides/                        # Marp decks (per-component + master onboarding deck)
  site/                          # Astro app (layouts, nav, components, styling)
  scripts/                       # build-pdf.js, build-png.js, build-almanac.js
  .github/workflows/deploy.yml   # build everything + deploy to Pages
  public/downloads/              # generated artifacts, linkable from the site
```

### Content model (frontmatter schema — makes all 5 outputs derive from one file)
```yaml
---
title:            # "Muni Tour"
slug:             # muni-tour
nav_group:        # About | Season | Competitions | Community
order:            # position in nav + Almanac
tagline:          # one-liner (hero + PNG headline)
summary:          # 2–3 sentences (card, PNG, deck opener)
key_facts:        # list of {label, value} — Format / When / How to qualify / etc.
standings_url:    # optional published-sheet embed
outputs: [page, pdf, png, slides]
---
# full body markdown (used by web page + Almanac; one-pager uses summary + key_facts + body)
```
Web page and Almanac render the full body; PNG and slide/one-pager templates pull
`tagline`/`summary`/`key_facts` so every component looks consistent everywhere.

---

## Information architecture (sitemap + nav)

```
Home / Start Here          ← approachable intro up front; "get involved in 3 steps"
├── About                  What's a Roost · Governing Principles · Exec Committee · Charity
├── The Season             Path to Nationals · Calendar
├── Competitions           Texas Two-Step (Major) · All-STROHs Open · OpnSzn · Muni Tour · Competition Notes
├── Standings & Results     Live standings (embedded sheets) + season-by-season archive
└── Community              Discord · Instagram · Writeups
```

**Competition page template (consistent across all four):** one-liner → format → dates →
how to post a score → how to qualify → live standings. Consistency makes the one-pagers and
decks nearly self-generating.

### Almanac content → component file mapping
- Pg1 TL;DR + Governing Principles → `getting-started.md` (TL;DR) + `about/governing-principles.md`
- Pg2 What is a Roost / name / Roost Club Championship → `about/what-is-a-roost.md` + `season/path-to-nationals.md`
- Pg3 Qualifying events + alternates + NIT → `season/path-to-nationals.md` + `about/executive-committee.md`
- Pg4 General Competition Notes → `competitions/competition-notes.md`
- Pg4–5 Two-Step / ASO → `competitions/texas-two-step.md`, `competitions/all-strohs-open.md`
- Pg5–7 OpnSzn → `competitions/opnszn.md`
- Pg7–9 Muni Tour (already finalized) → `competitions/muni-tour.md`
- Pg9 Getting Involved → `getting-started.md` + `community.md`
- Pg10 Website + Charity → `community.md` + `about/charity.md`

---

## The new-player introduction

The Almanac becomes the **deep reference**; the intro is the **gentle on-ramp**. Two artifacts
from `getting-started.md`:
- **Web "Start Here" page** — what we are (2 lines) → the 4 principles → **the one first step**
  (join Discord, post in #find-a-game) → the 4 competitions at a glance (simple table) → the
  path to the team → who to contact (@jdonelson, @omarmjhdpr).
- **Master onboarding slide deck** (Marp) — linkable, ~8–10 slides, "get up to speed in 5 minutes."
Tone: warm, welcoming, jargon-light. Explicitly addresses "the Discord can be overwhelming."

---

## Phased build plan

**Phase 0 — Foundations.** Create GitHub repo (under a STROH's org or Omar's account); Astro
skeleton; brand tokens (colors, logo, fonts); GitHub Actions → Pages deploy; wire custom domain.
*Done when:* a branded (empty) site is live on a Pages URL.

**Phase 1 — Content model & migration.** Finalize frontmatter schema; decompose the Almanac into
the per-component `.md` files above; keep prose but tighten for the web.
*Done when:* every component file exists and the Almanac content is fully ported.

**Phase 2 — Website.** Nav + Home/Start Here + the shared component page template + Competitions +
About + Season + Community; embed published standings sheets; migrate the results archive.
*Done when:* the full site is browsable and reflects the current season.

**Phase 3 — Artifact pipeline.** Branded HTML/CSS templates; `build-pdf` (one-pagers + compiled
Almanac), `build-png` (social), Marp decks (per-component + onboarding); all wired into CI and
published to `public/downloads/`, linked from each page.
*Done when:* pushing a content edit regenerates that component's page + PDF + PNG + deck + the Almanac.

**Phase 4 — Onboarding kit.** The Start Here page + master onboarding deck + a shareable
"Welcome to STROH's" one-pager.
*Done when:* a newcomer can go from zero → in a game using one linked page/deck.

**Phase 5 — Launch.** DNS cutover from WordPress to Pages; announce in Discord/Instagram; archive
or redirect the old site.

---

## Open items / decisions to confirm
- **Brand kit:** need STROH's primary logo files, color palette, and font choices (we have the
  MUNITOUR logo + a purple/orange palette to start from).
- **Domain/DNS:** who controls `strohs.club` DNS (needed for the Pages cutover).
- **Repo home:** new GitHub org for STROH's, or under a personal account? Who gets write access?
- **Results archive:** port all history from the current site, or start fresh + link the old site?
- **Content ownership:** Omar + Josh as editors/reviewers; lightweight PR review or direct commits?
- **Per-component decks vs. one onboarding deck:** confirm we want *both* (plan assumes yes).

## Verification (definition of done for a component)
Editing `content/<x>.md` and pushing should, via CI, update: the website page, its one-page PDF,
its social PNG, its slide deck, and the compiled Almanac — all downloadable from the site, all
on-brand and consistent, with the live site served at `strohs.club`.

## Suggested next step
Scaffold Phase 0 + a **vertical slice**: stand up the Astro repo and build **one** component
(the Muni Tour, since its content is finalized) end-to-end — web page + PDF + PNG + deck — as a
working proof of the whole pipeline before porting the rest.
