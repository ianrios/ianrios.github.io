# Epic: Visitor theming

Source: `.ai/specs/theme-ideas.md` (2 of 4 candidate ideas selected).
Approved by Ian 2026-07-09; both phases complete 2026-07-09.

## Phase 1 — Random theme per visitor ✅ DONE — see `.ai/completed/visitor-theming-phase-1-random-theme.md`

## Phase 2 — Theme interpolation dial ✅ DONE — see `.ai/completed/visitor-theming-phase-2-interpolation-dial.md`

(Shipped as a real rotary knob atom, not the linear from/to control this
phase's plan originally specified — see that file's status header.)

## Epic status

Both phases shipped 2026-07-09. A live-testing bug-fixing pass (Dial
label font-scale — proportional to Type Scale, floor raised to the old
max and growing past it — plus panel padding/animation/positioning fixes)
closed out 2026-07-14. `npm run check`, `npm test` (128 tests),
`npm run build` all green. Deployed 2026-07-14. "Change the default theme
later" and "scroll-driven theme swap" remain unscheduled in
`.ai/specs/theme-ideas.md`.
