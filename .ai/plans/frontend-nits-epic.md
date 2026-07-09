# Epic: Frontend nits (Ian's punch list)

Source: `.ai/specs/frontend-nits.md` (16 numbered items, #17 blank). Direction
scoped with Ian 2026-07-09: full spec in scope, split into 4 phases ordered
fastest/lowest-risk first. Pending Ian's go-ahead after peer review before
implementation starts (new epic, not yet an approved direction).

## Phase 1 — Home/nav/data quick wins

Items #1, #11, #12, #13, #16. See
`.ai/plans/frontend-nits-phase-1-quick-wins.md`.

## Phase 2 — Company-link icon button

Item #6. See `.ai/plans/frontend-nits-phase-2-company-link.md`.

## Phase 3 — Cursor + texture system

Items #2, #3, #4, #5, #7, #8, #9, #10. See
`.ai/plans/frontend-nits-phase-3-cursor-texture.md`.

## Phase 4 — About page overhaul

Items #14, #15. See `.ai/plans/frontend-nits-phase-4-about-overhaul.md`.
Depends on Phase 1 (item #16 adds a `role` field to `HobbyData` that this
phase's layout rework builds on).

## Sequencing note

Phase 1 touches `src/data.ts` fields that Phase 4 renders, so Phase 1 should
land before Phase 4. Phases 2 and 3 are independent of everything else and
can land in any order relative to 1/4.
