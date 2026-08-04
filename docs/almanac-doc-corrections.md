# Correcting the Almanac Google Doc, then retiring it

The site now generates its own Almanac from `content/` —
`public/downloads/strohs-almanac.pdf`, rebuilt on every push. It is already correct, because
every ruling in `RECONCILIATION.md` flowed into the markdown it derives from.

The decision (2026-08-04) is to **correct the Google Doc once so it isn't wrong for anyone
still holding the link, then stop maintaining it** and point people at the generated version.
After that, corrections happen in `content/` only.

Work through the list below, then add a line at the top of the doc along the lines of:

> **Superseded.** The current Almanac is generated from strohs.club and is always up to date.
> This copy is the 2026 edition and is no longer maintained.

## The corrections

| ID | Where | The doc says | It should say |
|---|---|---|---|
| **R-01** | p10 | "In 2026, we've designated **Kids Eat, Inc** as the charity of choice" | **Wonders and Worries** is the current charity. Kids Eat, Inc is not |
| **R-02** | p9 | a walk-off round "will count with a score of **100**" | **150** |
| **R-03** | p6 | Alt-Shot **7 / 5 / 3** | **7 / 5 / 2** — the stated +2 bonus applied to a 5/3/0 base. The printed 3 cannot come from that bonus |
| **R-07** | throughout, incl. the title | "**Southern** Texas Roost of Hospitality" | "**South** Texas Roost of Hospitality" |
| **R-09** | p5 | the ASO "will move to **the Fall**" | targeting **late October / early November 2026** |
| **R-11** | p1 | "Our **five** qualifiers will come from:" then lists four | **four** |
| **C-09** | p1, p3 | "No Laying Up Invitational Tournament" / "NLU Invitational Tournament" | **Nest Invitational Tournament** |
| **C-06** | p3 | **#gettinginvolved** | **#getinvolved** — p1 already has it right |

## Also needed

- **A Texas Cup section.** The event is real and ratified (`D-05`) but appears nowhere in the
  doc. The site's `content/competitions/texas-cup.md` is the source to copy from. Note it is
  *not* a Roost Regional qualifier, which is why it sits outside the four.

## Not corrections — deliberate differences

The doc and the site now disagree in a few places on purpose. Do not "fix" these:

- **Two-Step venue** is TBD on the site. Landa Park was removed, not deferred.
- **ASO entry** reads "estimated at $125" pending confirmation.
- **Two-Step entry** ($250) is written but withheld from the generated Almanac until ratified,
  so it will not appear there.
- The **2022 NLU blockquote** on `season/path-to-nationals.md` keeps its original 2022 dates and
  is introduced as a founding document (`C-07`).
