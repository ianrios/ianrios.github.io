# Epic: Visitor theming

Source: `.ai/specs/theme-ideas.md` (4 candidate ideas, "not scheduled").
Direction scoped with Ian 2026-07-09: 2 of the 4 ideas selected — random
theme per visitor, and the theme interpolation dial. "Change the default
theme later" and "scroll-driven theme swap" stay parked, unscheduled. Pending
Ian's go-ahead after peer review before implementation starts.

## Phase 1 — Random theme per visitor

See `.ai/plans/visitor-theming-phase-1-random-theme.md`. Small, no UI.

## Phase 2 — Theme interpolation dial

See `.ai/plans/visitor-theming-phase-2-interpolation-dial.md`. Larger — new
interpolation state model + UI, and it's one of the three deferred W3 items
already flagged in `.ai/WORK.md`.

## Sequencing note

Independent of each other and of the `frontend-nits` epic. Phase 2 is
significantly larger than Phase 1; either order is fine, but Phase 1 is the
faster win if sequencing matters.

## Shared constraint (both phases)

Both change what `DesignVarsProvider` persists on a visitor's first
encounter with the site. The `index.html` flash script only ever replays
`snapshot` — any code path that changes `theme`/`overrides` at runtime must
still end in a fresh `persistDesign(...)` call (already true for every
existing `setVar`/`applyTheme` path) so first paint on the next load matches.
