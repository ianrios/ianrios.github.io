# WORK.md

Current phase, priorities, and open questions ONLY. Completed work is
recorded by git history, `.ai/completed/`, and epic files — never here.
If a section here could be summarized, replace it with the summary.

## Current phase

`frontend-nits` epic (16 items), `visitor-theming` epic (random theme per
visitor + a rotary theme-blend `Dial` atom), and `mobile-polish` epic (nav
drawer persistence bug, slider/cursor touch fixes, title-click panel
gating, content centering/scaling/padding architecture, FunPanel removal,
cursor trail speed retune) all COMPLETE and DEPLOYED — see
`.ai/completed/frontend-nits-epic.md`,
`.ai/completed/visitor-theming-epic.md`,
`.ai/completed/mobile-polish-epic.md`. Two live-testing passes after the
initial `mobile-polish` merge (2026-07-14) found bugs automated checks
couldn't catch, all fixed and deployed same day: missing `min-width: 0` on
the content column, a default Stack `gap` creating an asymmetric
panel/content buffer, the reveal tab reserving layout width before it was
visible, a title-click gate wrongly requiring two clicks, a cursor
`:active` specificity bug beating the global `cursor: none` override, a
dead `flex-wrap: wrap` rule never applied to the Home tabs (large-scale
theme presets clipped the "projects" button off mobile screens), the
About page's floating links bar colliding with the mobile hamburger and
overflowing the device edge entirely (fixed by rendering the links inline
in normal scroll flow on mobile instead of floating them), and oversized
presets (Maximal, Brutalist) wrapping body text to 1-3 words per line on
mobile (fixed with a font-size ceiling at the Heading/Text atoms — clamping
the `--font-*` custom properties directly doesn't work, confirmed
empirically: circular self-reference through DesignVarsProvider's inline
styles). The deeper layout/theme bugs needed brief, explicitly
Ian-approved Playwright inspections (scratchpad-only, never added to this
project) after repeated static-analysis misses — see personal memory, not
duplicated here. Ian confirmed real-device mobile testing looks good.
`npm run check`, `npm test` (128 tests), `npm run build` all green
throughout; deployed to ianrios.me. Epics proceed autonomously
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

- Ian raised, not yet scoped: "rethink how to retool the themes on smaller
  devices" — the font-ceiling fix above is a reactive patch for the worst
  offenders (Maximal/Brutalist body text), not the broader redesign Ian
  invited ("propose a different combination of components for mobile" —
  e.g. About's links already went inline-on-mobile instead of mirroring
  desktop; Home/Experience/Projects haven't been reconsidered the same way).
  Needs a real proposal + his approval before any further mobile-specific
  component work, per the epic/direction-change gate.
- Pan-direction map: About = up, Contact = down (below home). Ian may
  re-map after feeling it out (`src/pages/navDirection.ts`).
- "title" nav item returns to the MetaBalls splash (agent proposal) —
  confirm this reads well vs. a plain /metaballs destination.
