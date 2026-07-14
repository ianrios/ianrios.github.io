# WORK.md

Current phase, priorities, and open questions ONLY. Completed work is
recorded by git history, `.ai/completed/`, and epic files — never here.
If a section here could be summarized, replace it with the summary.

## Current phase

`frontend-nits` epic (16 items) and `visitor-theming` epic (random theme
per visitor + a rotary theme-blend `Dial` atom) COMPLETE 2026-07-09 — see
`.ai/completed/frontend-nits-epic.md` and
`.ai/completed/visitor-theming-epic.md`. A live-testing bug-fixing pass on
both (dial font-scale proportionality, the four-separate-PushPanel-
instances bug → single shared instance under the new `PanelLayout` route
layout, About page sticky headers/fixed links bar) closed out and deployed
2026-07-14. `npm run check`, `npm test` (128 tests), `npm run build` all
green. Epics proceed autonomously (Ian, 2026-07-07): bring genuine
decision gaps, not approval check-ins.

## Priorities (Ian's order)

1. **Master-scale UI inside the FULL design-system panel** — the one item
   from the old V2 follow-ups DEFERRED note not yet picked up (FunPanel on
   About and the theme interpolation dial are both now done, the dial
   shipped as a new `Dial` atom).
2. **Pending Ian, not yet spec'd:** Atrix bullets/companyUrl, Petal +
   Cortex project write-ups (stubs live in `data.ts`).
3. **ImageBox** — not started. `.ai/specs/imagebox-epic.md`.
4. **Backlog specs** (unscheduled): `webgl-effects.md` (deliberately
   parked, needs its own bundle-size design before scoping); theme-ideas.md
   still has "change the default theme" and "scroll-driven theme swap"
   unscheduled; resume-page, font-picker, design-library-extraction,
   metaballs-overhaul — in `.ai/specs/`.

## Not in scope

- Playwright / e2e tests
- Backend or API of any kind
- Paid services

## Open questions

- Pan-direction map: About = up, Contact = down (below home). Ian may
  re-map after feeling it out (`src/pages/navDirection.ts`).
- "title" nav item returns to the MetaBalls splash (agent proposal) —
  confirm this reads well vs. a plain /metaballs destination.
- FunPanel concept lives on portfolio only; extend to About once Ian
  confirms it feels right.
