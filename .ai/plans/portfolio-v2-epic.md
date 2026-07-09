# Epic: Portfolio V2 Overhaul

Direction and all decisions: `.ai/plans/portfolio-v2-concepts.md`. Original
brainstorm (superseded): `.ai/completed/portfolio-overhaul.md`. Approved by
Ian 2026-07-07 ("let er rip") after a full interview + concept-discussion
session; phase-by-phase sub-plans still get peer-reviewed before code per
`.ai/WORKFLOW.md`.

## Phase 1 — Content & IA ✅ DONE — see `.ai/completed/portfolio-v2-epic-phase-1-content-ia.md`

## Phase 2 — Heading/Text sweep + layout primitives ✅ DONE — see `.ai/completed/portfolio-v2-epic-phase-2-heading-text-layout.md`

## Phase 2.5 — Layout primitive migration (Bob) ✅ DONE — see `.ai/completed/portfolio-v2-epic-phase-2.5-layout-primitives.md`

## Phase 2.6 — Quality & tooling (Bob) ✅ DONE — see `.ai/completed/portfolio-v2-epic-phase-2.6-quality-improvements.md`

## Phase 3 — V2 per-page layouts ✅ DONE — see `.ai/completed/portfolio-v2-epic-phase-3-per-page-layouts.md`

## Phase 4 — Floating draggable nav ✅ DONE — see `.ai/completed/portfolio-v2-epic-phase-4-floating-nav.md`

## Phase 5 — Page transitions (papers-on-a-table) ✅ DONE — see `.ai/completed/portfolio-v2-epic-phase-5-page-transitions.md`

## Phase 6 — Cursor + texture effects ✅ DONE — see `.ai/completed/portfolio-v2-epic-phase-6-effects.md` (WebGL remainder: `.ai/specs/webgl-effects.md`)

## Phase 7 — Mobile pass ✅ DONE — see `.ai/completed/portfolio-v2-epic-phase-7-mobile.md`

## Phase 8 — Closing ✅ DONE (2026-07-08, no sub-plan: small + mechanical)

Admin's tab switcher removed — `/design-system` IS the playground now.
`V2Preview.tsx` + `MixedProjectGrid.tsx` deleted with their fixtures and
styles; the reachability root list shrank to `DSPreview`. The Admin and
ThreeScene "back to portfolio" links removed: `SiteNav` (floating remote /
mobile drawer) is the sole page-to-page nav, per concepts section 8.

## Epic status

All phases complete 2026-07-08. Acceptance = Ian's visual pass (desktop +
responsive/mobile) and `npm run deploy`.

## Independent, no phase dependency (land anytime)

- Cookie consent banner ✅ DONE — see `.ai/completed/cookie-consent-banner.md`
- Padding/width bug audit + fix ✅ DONE — flex-wrap on admin action rows
