# WORK.md

Current phase, priorities, and open questions ONLY. Completed work is
recorded by git history, `.ai/completed/`, and epic files — never here.
If a section here could be summarized, replace it with the summary.

## Current phase

`frontend-nits` epic (16 items), `visitor-theming` epic (random theme per
visitor + a rotary theme-blend `Dial` atom), and `mobile-polish` epic (nav
drawer persistence bug, slider/cursor touch fixes, title-click panel
gating, content centering/scaling/padding architecture, FunPanel removal,
cursor trail speed retune) all COMPLETE and DEPLOYED (2026-07-14) — see
`.ai/completed/frontend-nits-epic.md`,
`.ai/completed/visitor-theming-epic.md`,
`.ai/completed/mobile-polish-epic.md`. A live-testing pass on
`mobile-polish` immediately after the initial merge found five real layout
bugs automated checks couldn't catch, all in the shared panel/content
layout: missing `min-width: 0` on the content column (flex default blocked
it from shrinking when the panel opened), a default Stack `gap` on
`PanelLayout.tsx`'s outer row creating an asymmetric buffer between panel
and content, the reveal tab reserving real layout width before it was ever
visible (nothing actually "pushed" at the reveal moment), a title-click
gate that wrongly required two clicks instead of one, and a cursor-CSS
specificity bug (`:active` grab cursor beating the global `cursor: none`
override). The last two layout bugs needed a one-time, explicitly
Ian-approved Playwright inspection (scratchpad-only, never added to this
project) after repeated static-analysis misses — see personal memory, not
duplicated here. `npm run check`, `npm test` (128 tests), `npm run build`
all green; deployed to ianrios.me. Epics proceed autonomously
(Ian, 2026-07-07): bring genuine decision gaps, not approval check-ins.

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

- `mobile-polish` is deployed; Ian is testing on a real mobile device next
  (touch drag, cursor hiding, panel layout at actual mobile widths) — the
  dev-server pass only covers desktop viewport emulation.
- Pan-direction map: About = up, Contact = down (below home). Ian may
  re-map after feeling it out (`src/pages/navDirection.ts`).
- "title" nav item returns to the MetaBalls splash (agent proposal) —
  confirm this reads well vs. a plain /metaballs destination.
