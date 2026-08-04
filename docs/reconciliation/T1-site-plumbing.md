# Reconciliation shard — T1 (site plumbing)

Items for the barrier agent to fold into `docs/RECONCILIATION.md`. IDs are **proposed**: `R-11`
was the last one taken in the register, and `docs/reconciliation/T2-cicd.md` has claimed `R-12`,
so this shard starts at `R-13`. Renumber freely — nothing cites these yet.

---

## Open questions — nav behaviour

| ID | Topic | One side says | The other says | Severity |
|---|---|---|---|---|
| **R-13** | Standings dropdown membership | The T1 brief: leave the Standings dropdown *exactly* as it is — five links, all `#`, standings deferred this round | The dropdown is `competitions.map(...)`, so the `kind: notes` page T4 adds to the competitions collection will appear in it as a sixth, meaningless "standings" link | Medium — visible nav defect, but the fix touches deferred UI |

Not resolved here, because "don't touch Standings" was explicit and this is a judgement call
about what that instruction was protecting.

- **If the instruction meant "don't invest in standings"**: the fix is one clause in
  `site/components/Nav.astro` — filter the `competitions` array used by the Standings dropdown
  on `c.data.kind === 'competition'`, exactly as `site/pages/index.astro` now filters the cards.
  Observable behaviour today is unchanged (still the same five links).
- **If it meant "do not edit that markup at all"**: the dropdown grows a bogus entry the moment
  T4 lands, and no later track owns `Nav.astro` to fix it.

`site/components/Nav.astro` is not owned by any track after T1, so this needs a ruling in the
barrier step rather than being left to a later phase.

**Resolved in the barrier step — R-13 is closed.** Read as "don't invest in standings": the
`kind === 'competition'` filter is applied to the Standings array. The rendered dropdown is
byte-identical today (same five links, all `#`); only T4's future `kind: notes` entry is
excluded. Standings URLs themselves remain deferred.
