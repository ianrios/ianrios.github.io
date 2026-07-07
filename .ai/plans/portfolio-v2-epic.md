# Epic: Portfolio V2 Overhaul

Direction and all decisions: `.ai/plans/portfolio-v2-concepts.md`. Original
brainstorm (superseded): `.ai/specs/portfolio-overhaul.md`. Approved by Ian
2026-07-07 ("let er rip") after a full interview + concept-discussion
session; phase-by-phase sub-plans still get peer-reviewed before code per
`.ai/WORKFLOW.md`.

## Phase 1 — Content & IA ✅ DONE — see `.ai/plans/portfolio-v2-epic-phase-1-content-ia.md`

## Phase 2 — Heading/Text sweep + layout primitives ✅ DONE — see `.ai/plans/portfolio-v2-epic-phase-2-heading-text-layout.md`

## Phase 3 — V2 per-page layouts ✅ DONE — see `.ai/plans/portfolio-v2-epic-phase-3-per-page-layouts.md`

## Phase 4 — Floating draggable nav

Not started. Depends on phase 2 (layout primitives) for the panel itself.
See concepts doc section 1. Must also REMOVE the interim "Back to
portfolio" Button on `About.tsx` (Ian flagged it 2026-07-07) — the floating
nav is the sole page-to-page nav UI. `NotFound.tsx`'s link stays (a 404
must offer a way out even if the nav fails to mount).

## Phase 5 — Page transitions (papers-on-a-table)

Not started. Depends on phase 4 (nav is the trigger) and phase 3 (real
pages to transition between). Wires into the `Button.tsx` internal
`RouterLink` chokepoint per concepts doc section 8 — no changes to existing
content links required.

## Phase 6 — Cursor, texture filter, WebGL hover effects (admin-configurable)

Not started. Depends on phase 3 layouts existing to apply effects to. See
original spec items 5, 19, 20.

## Phase 7 — Mobile pass

Not started. Deliberately last of the visual phases — done properly against
a stable layout/nav/transition system, not a moving target, per Ian's
explicit call.

## Phase 8 — Closing: remove placeholder admin buttons

Not started. Remove [Design System] / [Portfolio v2 Preview] / [Home (live)]
buttons once V2 fully replaces V1 (original spec item 24). Trivial, blocked
only on the rest of this epic being done.

## Independent, no phase dependency (land anytime)

- Cookie consent banner ✅ DONE — see `.ai/plans/cookie-consent-banner.md`
- Padding/width bug audit + fix ✅ DONE — flex-wrap on admin action rows
