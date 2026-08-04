# strohs.club

The STROH's website + shared documents, built from markdown. **One markdown file per component
is the single source of truth** → it renders a website page *and* generates a branded one-page
PDF, a social PNG, and a slide deck. A compiled long-form Almanac is assembled from all components.

## Structure
```
content/                     # the source of truth — one .md per component
  about.md
  competitions/*.md          # one markdown file per competition
templates/                   # branded HTML/CSS for the PDF one-pagers + social PNGs
  brand.mjs  one-pager.mjs  social.mjs
slides/                      # Marp deck sources
  onboarding.md  theme.css
site/                        # the Astro app — nothing but presentation
  content.config.mjs         # collection schemas over content/
  pages/index.astro          # Home / Start Here
  pages/[page].astro         # renders content/*.md
  pages/competitions/[slug].astro
  layouts/                   # Base + Page + Competition
  components/                # Nav, Gallery
  styles/global.css          # brand tokens (see docs/BRAND.md)
scripts/                     # doc pipeline (reads the same content/ as the site)
  build-pdf.mjs  build-png.mjs  build-slides.mjs  build-all.mjs
  lib/content.mjs  lib/paths.mjs
public/brand/                # logos + hero art (exported, web-ready)
public/downloads/            # generated docs (PDF / PNG / slides)
Logos-Art/                   # source art — the originals public/brand/ is exported from
docs/                        # source material, not shipped
  2026-strohs-almanac.pdf    # the Almanac content/ is being decomposed from
  BRAND.md                   # palette, typography, logo inventory
  strohs-web-overhaul-plan.md
```

`content/` is read twice — by Astro (as content collections) and by `scripts/` (as raw
frontmatter) — so a single edit updates the page and every generated artifact.

## Commands
```
npm run dev        # local dev server (site)
npm run ci         # the full build: docs first, then site (see ordering note below)
npm run build      # just the static site → dist/
npm run docs       # generate PDF + PNG + slides for every competition → public/downloads/
npm run docs:pdf   # just the PDFs
npm run docs:png   # just the social images
npm run docs:slides
```

**Ordering matters:** `astro build` copies `public/` into `dist/`, so `docs` must run *before*
`build` or the deployed site serves the previous run's downloads. Use `npm run ci`.

## How the docs are generated
`scripts/` read each `content/competitions/*.md` (frontmatter + body), then:
- **PDF / PNG** — render a `templates/` HTML template with headless Chrome (`puppeteer-core`
  pointed at the system Google Chrome; override with `CHROME_PATH`).
- **Slides** — expand `slides/onboarding.md`, replacing its `<!-- @competitions -->` placeholder
  with a slide per competition, then export HTML with [Marp](https://marp.app).

No browser is downloaded — it reuses the installed Chrome. Later, GitHub Actions will run
`npm run ci` and deploy to GitHub Pages.

The PNGs and the Marp deck are committed; the PDFs are gitignored because PDF output embeds a
creation timestamp and would churn on every run.

## Adding a competition
Drop a new `content/competitions/<slug>.md` with the frontmatter fields required by
`site/content.config.mjs` (`title, slug, navGroup, order, tagline, blurb, summary, accent, hero,
logo, keyFacts[], outputs[]`) + body. The nav, the home page cards, the site page, and all three
docs pick it up automatically — nothing else to register.
