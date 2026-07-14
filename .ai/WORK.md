# WORK.md

Current phase, priorities, and open questions ONLY. Completed work is
recorded by git history, `.ai/completed/`, and epic files — never here.
If a section here could be summarized, replace it with the summary.

## Current phase

`frontend-nits` epic (16 items), `visitor-theming` epic (random theme per
visitor + a rotary theme-blend `Dial` atom), and `mobile-polish` epic (nav
drawer persistence bug, slider/cursor touch fixes, title-click panel
gating, content centering/scaling/padding architecture, FunPanel removal,
cursor trail speed retune) all COMPLETE — see `.ai/completed/
frontend-nits-epic.md`, `.ai/completed/visitor-theming-epic.md`,
`.ai/completed/mobile-polish-epic.md`. A live-testing pass on
`mobile-polish` immediately after found two real bugs the automated checks
couldn't catch: (1) the content column had no `min-width: 0`, so flexbox's
default `min-width: auto` on a flex item stopped it from actually shrinking
when the panel opened — it just overflowed and got clipped by the row's
own `overflow: hidden`, reading as "didn't shift" and losing right-side
padding to the clip (fixed: `.skeu-panel-content { min-width: 0; }` in
`_organisms.scss`, applied to `PanelLayout.tsx`'s content column). (2) the
title-click gating in `RouteTransitions.tsx` required two separate clicks
to actually navigate once the panel had been closed — Ian confirmed he
never asked for two clicks; fixed to close the panel and navigate on one
click, staggered by a `--anim-speed`-matched delay so the panel's own close
animation visibly finishes first. `npm run check`, `npm test` (128 tests)
green after both fixes; `npm run build` green as of the epic's initial
merge. Not yet deployed. Epics proceed autonomously (Ian, 2026-07-07):
bring genuine decision gaps, not approval check-ins.

## Priorities (Ian's order)

1. **Pending Ian, not yet spec'd:** Atrix bullets/companyUrl, Petal +
   Cortex project write-ups (stubs live in `data.ts`).
2. **ImageBox** — not started. `.ai/specs/imagebox-epic.md`.
3. **Backlog specs** (unscheduled): `webgl-effects.md` (deliberately
   parked, needs its own bundle-size design before scoping); theme-ideas.md
   still has "change the default theme" and "scroll-driven theme swap"
   unscheduled; resume-page, font-picker, design-library-extraction,
   metaballs-overhaul — in `.ai/specs/`.

## Not in scope

- Playwright / e2e tests, and browser automation in general — this covers
  ad-hoc diagnostic use too (e.g. inspecting computed styles to debug a
  layout bug), not just a formal test suite. Diagnose from source; visual/
  behavioral confirmation is Ian's to do directly on the dev server.
- Backend or API of any kind
- Paid services

## Open questions

- `mobile-polish` epic shipped 2026-07-14 with automated checks green, but
  per this project's verification convention, visual/behavioral
  confirmation (content centering/scaling across viewport widths, cursor
  trail feel across presets, mobile drag/touch behavior) is Ian's to do
  directly on the dev server before considering it deploy-ready.
- Pan-direction map: About = up, Contact = down (below home). Ian may
  re-map after feeling it out (`src/pages/navDirection.ts`).
- "title" nav item returns to the MetaBalls splash (agent proposal) —
  confirm this reads well vs. a plain /metaballs destination.
