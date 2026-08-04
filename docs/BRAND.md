# STROH's Brand Kit & Tokens

Source art lives in `../Logos-Art/`. This file is the single reference the website (Astro) and
the document templates (PDF / PNG / slides) both consume. Colors sampled from the logo files.

## Identity
Heraldic **navy shield** + **crimson rampant lion holding a golf club** (crowned), with the
vintage **"Stroh's" script** wordmark (a play on the old Stroh's beer logo). Vibe: classic,
collegiate/athletic, a little irreverent. Parent brand = navy + crimson + cream on white.

## Core palette (parent brand)
| Token | Hex | Use |
|---|---|---|
| `--navy` | `#002060` | Primary dark: site chrome, headings, shield outline |
| `--crimson` | `#C00840` | Primary accent: links, CTAs, the lion/wordmark |
| `--cream` | `#F8E8B8` | Warm vintage neutral / section backgrounds |
| `--ink` | `#1A1A2E` | Body text |
| `--paper` | `#FFFFFF` | Page background |
| `--navy-tint` | `#E9EDF5` | Light navy wash for cards/dividers |

## Sub-brand accents (per competition — use on that competition's page/docs only)
| Competition | Accent(s) | Notes |
|---|---|---|
| Muni Tour | purple `#4A1D8A`, orange `#E97724` | MUNITOUR wordmark logo |
| La Rouxst (colony) | red `#A81028`, navy `#001838`, cream `#F8E8B8` | "a STROH's colony", art on black |
| Texas Two-Step | (from `2026TXTwoStep/` art) | Shiner-lion banner set |
| All-STROHs Open | (from `STROHSAllSTROHSOpen3`) | — |
| OpnSzn / Match Play | (from `STROHSMatchPlay`) | — |
| Sixers on Ice | (from Sixers badges/lettering) | seasonal |

Rule of thumb: **parent navy/crimson for global chrome; competition accent + hero art within
that competition's page and its generated docs.**

## Typography (recommended — free/Google Fonts, swap freely)
- **Display / headings:** a heritage-athletic face — e.g. **Fraunces** (serif) or **Zilla Slab**
  (slab). Pairs with the vintage script logo without competing with it.
- **Body / UI:** a clean, legible sans — **Inter** or **Source Sans 3**.
- The "Stroh's" script is **logo art only** — do not set text in a script font.

## Logo inventory → usage
**Primary / org marks**
- `strohs-badge.png` (750²) — **primary logo** (shield + lion + script), light backgrounds.
- `STROHsLionText_Red_Big.png` / `..._Blue_Big.png` (3000²) — full lockups, hi-res (print/hero).
- `STROHsLion1.png` (1000²) — lion only (favicon, watermark, small marks).
- `STROHStextRed.png` / `STROHStext…` — wordmark only.

**Per-competition hero art**
- Muni Tour: `MuniTourChampionship1_nobackgroundPNG.png` (+ `_backgroundJPG.jpg`)
- All-STROHs Open: `STROHSAllSTROHSOpen3.png`
- OpnSzn / Match Play: `STROHSMatchPlay.jpg`
- Texas Two-Step: `2026TXTwoStep/` → `02 AllTogether.png`, `03 Banner.png`, `04 ShinerLion.png`
- Sixers on Ice: `SixersOnIceLettering.png`, `STROHsLionSixersBadge_2.png`, `…23--1st/2nd.png`
- La Rouxst: `la-rouxst.png`, `la_rouxst_sticker_border.png`, `la-rouxst-lsu.png`

**Contextual / fun (socials, page heroes, trip pages)**
- `StrohsAstros2`, `STROHSSpurs3`, `STROHSChicken*`, `STROHStakeBoot3`, `StrohsSweetensBarrell`
  (Sweetens Cove = the national championship venue), `MastersSTROHSflag`, `BandonStrohs*`,
  `dhs.png`, `OurLadyArborista` (no extension — likely image/PSD; confirm).

## Notes / to confirm
- Do we have **vector** (SVG/AI/EPS) versions of the primary badge? Raster maxes at 750–3000px;
  vector would be ideal for crisp scaling on web + print. `STROHsLionText_Red.psd` exists (layered).
- `OurLadyAborista` / `OurLadyArborista_2` have no file extension — confirm type/intended use.
- Confirm exact hex from a brand owner if these were ever formally specified; values here are
  sampled from the PNGs and are accurate to the eye.
