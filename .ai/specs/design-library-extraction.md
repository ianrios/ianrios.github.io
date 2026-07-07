# Design library as its own package — future spec (Ian, 2026-07-07)

Not scheduled. Raised during the portfolio-v2 concept discussion
(`.ai/plans/portfolio-v2-concepts.md`, section 10) — not part of the
original `portfolio-overhaul.md` list, surfaced in conversation instead.

Eventually migrate `src/components/` + `src/styles/token-registry.ts` +
the SCSS tier partials out of this repo into their own package/repo, so
Petal and WRC can import the same design system instead of duplicating it.

Blocked on, when picked up:

- A repo/package name (not decided)
- Whether the portfolio site's `/design-system` admin playground moves with
  it or stays here as a consumer of the extracted package
- This should happen only after the V2 epic's layout-primitive gap
  (`Stack`/`Section`/`Heading`/`Text`, see concepts doc section 0) is
  closed — extracting an incomplete system just relocates the problem
