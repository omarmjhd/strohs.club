# strohs.club

The STROH's website + shared documents, built from markdown. **One markdown file per component
is the single source of truth** → it renders a website page *and* generates a branded one-page
PDF, a social PNG, and a slide deck. A compiled long-form Almanac is assembled from all components.

## Structure
```
content/                     # the source of truth — one .md per component
  getting-started.md         # a root page: belongs to no nav group
  about/*.md                 # a nav section is a directory of pages…
  season/*.md
  community.md               # …or a single file claimed by a group
  competitions/*.md          # the competitions collection (+ competition-notes.md)
site/                        # the Astro app — nothing but presentation
  lib/nav.mjs                # the registry: nav group → directory → collection
  content.config.mjs         # collection schemas over content/
  pages/index.astro          # Home / Start Here
  pages/[...page].astro      # renders every `pages` entry at its content/ path
  pages/competitions/[slug].astro
  layouts/                   # Base + Page + Competition
  components/                # Nav, Gallery
  styles/global.css          # brand tokens (see docs/BRAND.md)
templates/                   # branded HTML/CSS for the generated documents
  brand.mjs  one-pager.mjs  social.mjs  almanac.mjs
slides/                      # Marp deck sources
  onboarding.md  theme.css
scripts/                     # doc pipeline (reads the same content/ as the site)
  build-pdf.mjs  build-png.mjs  build-slides.mjs  build-almanac.mjs  build-all.mjs
  lib/content.mjs  lib/paths.mjs
public/brand/                # logos + hero art (exported, web-ready)
public/downloads/            # generated docs (PDF / PNG / slides / Almanac)
Logos-Art/                   # source art — the originals public/brand/ is exported from
docs/                        # source material, not shipped
  2026-strohs-almanac.pdf    # the Almanac content/ is being decomposed from
  BRAND.md                   # palette, typography, logo inventory
  RECONCILIATION.md          # open questions where the Almanac and the site disagree
  strohs-web-overhaul-plan.md
```

`content/` is read twice — by Astro (as content collections) and by `scripts/` (as raw
frontmatter) — so a single edit updates the page and every generated artifact.

**`site/lib/nav.mjs` is where a section is registered**, and it is the only place. Its `NAV`
array maps a nav group to a directory and a collection; `ROOT_PAGES` lists pages in no group.
Both readers import it — Astro derives the `pages` glob and the nav menu from it, `scripts/`
derives document order in the Almanac from it — so it stays free of `astro:` imports. Array
order is the cross-group order; `order` frontmatter sorts within a group.

## Commands
```
npm run dev        # local dev server (site)
npm run ci         # the full build: docs first, then site (see ordering note below)
npm run build      # just the static site → dist/
npm run docs       # generate every artifact → public/downloads/
npm run docs:pdf   # just the PDFs
npm run docs:png   # just the social images
npm run docs:slides
npm run docs:almanac
```

**Ordering matters:** `astro build` copies `public/` into `dist/`, so `docs` must run *before*
`build` or the deployed site serves the previous run's downloads. Use `npm run ci`.

## How the docs are generated
`scripts/` read each `content/**/*.md` (frontmatter + body), then:
- **PDF / PNG** — render a `templates/` HTML template with headless Chrome (`puppeteer-core`
  pointed at the system Google Chrome; override with `CHROME_PATH`).
- **Slides** — expand `slides/onboarding.md`, replacing its `<!-- @competitions -->` placeholder
  with a slide per competition, then export HTML with [Marp](https://marp.app).
- **Almanac** — `build-almanac.mjs` compiles every non-draft component into one long-form PDF,
  in nav order, with a TOC and an appendix listing what was held back.

No browser is downloaded — it reuses the installed Chrome. `.github/workflows/deploy.yml` runs
`npm run ci` on every push to `main` and publishes `dist/` to GitHub Pages.

The PNGs and the Marp deck are committed; the PDFs are gitignored because PDF output embeds a
creation timestamp and would churn on every run.

### The `outputs` contract
Each component declares which artifacts it wants: `outputs: [page, pdf, png, slides]`. That list
is the only gate — `wants()` in `scripts/lib/content.mjs` checks it, and
`site/layouts/Competition.astro` renders its Documents panel from the same list, so the two agree
by construction. Add an output and the file appears; remove one and `build-all.mjs` prunes the
orphan from `public/downloads/`. The Almanac is the exception: it ignores `outputs` and compiles
every component that isn't a whole-file draft.

### Draft markers
Prose that is on the site but not yet ratified is wrapped in `<!-- draft:D-01 -->` …
`<!-- /draft:D-01 -->`, each marker alone on its own line, the ID being a row in
`docs/RECONCILIATION.md`. It still renders on the website; `scripts/lib/content.mjs` drops it
from every PDF, PNG, deck and the Almanac, and a remark plugin in `astro.config.mjs` keeps the
markers themselves out of the published HTML. The same syntax works inside frontmatter strings —
a value that is entirely marked drops out, and a `{label, value}` fact that loses either half is
dropped whole. For a whole file use `status: draft` with `draftIds: [D-05]` instead: that
suppresses every artifact and names the file in the Almanac's omissions appendix.

## Adding content
**A competition** — drop `content/competitions/<slug>.md` with the fields the `competitions`
schema in `site/content.config.mjs` requires (`title, slug, navGroup, order`; then any of
`kind, tagline, blurb, summary, accent, hero, logo, keyFacts[], social{}, outputs[]`) + body. The
nav, the home page cards, the site page and every artifact in `outputs` pick it up automatically.

**A plain page** — drop it in the directory of the nav group it belongs to
(`content/about/history.md` → `/about/history`) with `title` and `order`. `pagePatterns()` in
`site/lib/nav.mjs` already globs the whole directory, so there is nothing to register. A page in
no group goes at the root of `content/` and gets added to `ROOT_PAGES`.

**A new nav group** — one entry in `NAV`, plus the directory. Nav, routes and Almanac order all
follow from it.

Two traps worth knowing. Never put `slug` in a *page's* frontmatter: Astro's glob loader returns
`data.slug` as the entry id when present, silently overriding the file path and moving the URL.
And two entries that resolve to the same id do not error — the content store dedupes, and the
last one quietly wins.
