# Reconciliation shard — T2 (CI/CD)

Items for the barrier agent to fold into `docs/RECONCILIATION.md`. IDs are **proposed**: `R-11`
was the last one taken when this shard was written, so `R-12` is the next free slot. If another
track also claimed `R-12`, renumber this one — nothing cites it yet.

---

## Conflicts — deploy config vs. site config

| ID | Topic | One side says | The other says | Severity |
|---|---|---|---|---|
| **R-12** | Canonical hostname | `astro.config.mjs`: `site: 'https://www.strohs.club'` — every canonical tag, sitemap URL, and absolute link Astro emits is **www** | `public/CNAME`: `strohs.club` — GitHub Pages will serve, and redirect to, the **apex** | **High** — the deployed site would advertise a hostname other than the one it is served from |

Not resolved here, because it is a decision, not a bug, and the fix lands in a file this track
does not own:

- **If apex is canonical** (what the deploy brief specifies): `site` in `astro.config.mjs` must
  drop the `www.`. DNS needs the four Pages A records on the apex
  (`185.199.108–111.153`, plus the AAAA equivalents) and a `www` CNAME to `omarmjhd.github.io`
  so the www→apex redirect works.
- **If www is canonical**: `public/CNAME` must become `www.strohs.club` instead, and DNS is a
  single `www` CNAME to `omarmjhd.github.io` plus apex A records for the reverse redirect.

Either choice is one-line. Picking the wrong one publishes mismatched canonical URLs to search
engines for as long as it stands, which is why it is filed rather than guessed. The WordPress
site being replaced presumably already answers this — whichever host it currently serves is
almost certainly the one to keep.
