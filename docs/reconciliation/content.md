# Reconciliation shard — T3 (content decomposition)

Items for the barrier agent to fold into `docs/RECONCILIATION.md`. Existing `R-nn` / `D-nn` IDs
are cited where they already cover the item; genuinely new findings are numbered `C-01`…`C-08`
per the T3 brief. Nothing here has been decided.

---

## Existing register items this track touched

| ID | Where it now lives | What T3 did — and what the ruling will cost |
|---|---|---|
| **R-01** | `content/about/charity.md` | **Deliberately unresolved.** The page carries the mechanics (season-long drive, creative giving, the `$1 per net birdie` example, the "doesn't change every year" line) and names *Austin Firefighters Relief and Outreach Fund* and *Wonders and Worries* as **past** recipients only — that framing is true on both sides of R-01. It never names a current-season charity. The old `about.md` quick fact `2026 Charity: Wonders and Worries` was **not** carried into `about/index.md`. Once R-01 is ruled, one sentence gets added under "This season"; nothing else changes. |
| **R-07** | `content/about/what-is-a-roost.md`, `content/about/governing-principles.md` | `what-is-a-roost.md` reproduces `about.md` verbatim, so it says **South** Texas Roost of Hospitality. The Almanac p1 lead-in restored into `governing-principles.md` says "Southern" in the source; T3 wrote **South** to match prevailing site convention rather than introduce a third variant on a page next to the others. If R-07 rules "Southern", it is a one-word edit in each of those two files plus the site chrome T3 does not own. |
| **R-10** | `content/season/path-to-nationals.md` | Uses "Sweetens Cove Golf **Club**" (Almanac p2 + existing site form) in prose and bare "Sweetens Cove" in quick facts. |
| **R-11** | `content/season/path-to-nationals.md`, `content/getting-started.md` | Both say **four** qualifiers, per the register's note that the site is right and the Almanac's "five" is a bug. The Almanac's own p1 list of four is reproduced as four. |
| **D-05** | see **C-05** below | |

---

## New findings

### C-01 — Instagram has no source anywhere
`instagram.com/strohs_roost` appears only in the site footer (`site/layouts/Base.astro`). It is
in neither the Almanac nor `content/about.md`. T3 carried it forward into `content/community.md`
as instructed — once in `quickFacts`, once in an "Elsewhere" section — so it is now asserted in
content, not just chrome. **Needs confirmation that the handle is live and ours.** If it isn't,
delete two lines from `community.md` and one from the footer.

### C-02 — Public Discord invite URL vs. the Almanac's invite-on-request
Almanac p9: "contact @jdonelson, @omarmjhdpr, or any other Stroh on the refuge (or directly) to
get an invite link" — i.e. invites are requested. `content/about.md` published a standing invite
URL (`discord.gg/frNSUn5ZmC`), which is also hard-coded in `site/pages/index.astro`.
`content/community.md` and `content/getting-started.md` carry the public URL **and** the
ask-a-human path, presenting both. Low severity, but it is a live posture question: a permanent
public invite link on a public site is a different access policy from the one the Almanac
describes, and only Omar/Josh can say which is intended.

### C-03 — `getting-started.md` renders on two pages; enriching it changed the home page
`site/pages/index.astro` renders the `getting-started` entry body inline, so the enrichment T3
was asked to make lands on `/` as well as `/getting-started`. On the home page it now sits
between a hero and a "The Competitions" card grid, producing two soft overlaps:

- the new **Competitions at a Glance** table vs. the existing competition cards below it
  (different information — format and what it earns you, vs. logo and blurb — but adjacent);
- the new **Path to the Team** section vs. the hero tagline's framing.

T3 mitigated what it could inside the file it owns: the "what we are in two lines" the plan asks
for went into the `subtitle` **frontmatter**, which `Page.astro` renders on `/getting-started`
and `index.astro` does not render at all — so that part does not duplicate the hero.
`site/pages/index.astro` is owned by no track after T1, so the remaining overlap needs a ruling.
Cheapest fixes if it reads badly: drop the card grid from `index.astro`, or render only a
`<Content />` excerpt there.

### C-04 — All four competition dates are contested, so the at-a-glance table has no "When" column
R-04, R-05, R-08 and R-09 between them make every date T3 would have put in the
`getting-started.md` competitions table an open question. Rather than pick a side four times in
a table skimmed by newcomers, the table has **What it is** and **What it earns you** only, and
sends readers to the competition pages for dates. Once those four are ruled, add a `When`
column — the table is already three columns wide and has room.

### C-05 — Texas Cup deliberately omitted from both overview pages (relates to D-05)
Texas Cup appears nowhere in the Almanac and the north-star plan's file list omits it (D-05), but
`content/competitions/texas-cup.md` exists and `site/pages/index.astro` says "plus the Texas Cup
for bragging rights". T3 left it out of the `getting-started.md` at-a-glance table and out of the
`path-to-nationals.md` qualifier list, on the narrow ground that **it is not a Roost Regional
qualifier** — which is true regardless of how D-05 is resolved. The result is that the home page
mentions Texas Cup and the two pages that enumerate competitions do not. If D-05 confirms the
event, both pages should gain a line placing it as a non-qualifying team event.

### C-06 — The Almanac contradicts itself on the hashtag
p1 writes **#getinvolved**; p3 writes **#gettinginvolved**. `governing-principles.md` uses the p1
form because that is the sentence it is restoring. `path-to-nationals.md` paraphrases the p3
sentence as "more about getting involved and enjoying the game" rather than pick a spelling.
Trivial, but it is the org's own hashtag and it should be spelled one way.

### C-07 — The 2022 blockquote's dates contradict the current championship window
The NLU crew blockquote (Almanac p2, reproduced verbatim in `path-to-nationals.md`) says the
Championship "will be held in Late August or September of 2022". Everywhere else — Almanac p1,
the old `about.md` — says late October at Sweetens Cove. This is **not** a conflict: the quote is
a 2022 founding document. T3 handled it editorially, introducing the quote as "how they described
it when they sent the original doc round in 2022" and following it with an explicit note that the
dates in it are 2022's while the team-of-four and Nest-member rules still govern. Flagging only so
a later reader doesn't "fix" the quote. The Almanac also carries a `LINK` to a Google Doc here
(`docs.google.com/document/d/17HET…`); T3 did not reproduce that link, as it is presumably not
public.

### C-08 — Almanac claims still without a home after this pass
From the register's "Almanac content not yet anywhere in `content/`" list, T3's files absorbed:
the 2022 NLU blockquote, the Executive Committee detail in full, and the competition philosophy
line. The rest belong to `content/competitions/**` (T4's territory) and are not covered here:
teebox guidance, the three-tier rule hierarchy, the 9-shot max provenance, Muni Tour
weather/act-of-god handling, and ties splitting evenly.

One item has **no owner this round**: the **standings publication plan** (p8 — per-course and
overall playoff-picture leaderboards, publicly available, on the STROH's website, Google Sheet in
the interim). Its natural home is `content/standings.md`, which the user explicitly deferred, and
T3 was instructed not to create it. It is therefore still unported, and will stay that way until
standings are picked back up.

### C-09 — what the "NIT" acronym stands for (added by the barrier, not by T3)
Three variants are now in play and none of them agree:

- **Deleted `about.md`:** "**Nest** Invitational Tournament (NIT)" — the long-standing site wording.
- **Almanac:** "**No Laying Up** Invitational Tournament (NIT)" (p1) and "NLU Invitational
  Tournament (NIT)" (p3). Consistent with itself; never says "Nest".
- **What shipped:** `season/path-to-nationals.md` says "**NLU Invitational (NIT)**" and
  `competitions/two-step.md` says "an invitation to the **NLU Invitational**" — a third form that
  drops "Tournament", so the acronym no longer derives from the words it abbreviates.

Two separate questions, and the barrier resolved neither: (a) Nest vs. No Laying Up — a real
source conflict of the same shape as R-07, and the site's prior wording was silently replaced
rather than logged; (b) whether "Tournament" belongs in the expansion, which is a transcription
slip against the Almanac rather than a conflict. Ruling (b) alone is a one-word edit in the two
files above. Prose was left untouched pending both.

---

## Content dropped from `content/about.md` on purpose

`content/about.md` was deleted after its sections were rehomed. Two things in it were not carried
anywhere, neither of them a conflict:

- **"Dedicated pages for the others are coming soon."** Stale — all four competition pages exist.
- **The `2026 Charity` quick fact.** Held back under R-01 (see above).

Everything else in `about.md` is now in `about/what-is-a-roost.md`,
`about/governing-principles.md`, `about/executive-committee.md`, `about/charity.md`,
`season/path-to-nationals.md`, or `community.md`.
