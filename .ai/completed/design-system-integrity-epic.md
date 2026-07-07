# Epic: Design System Integrity

Status: ✅ COMPLETE 2026-07-06. Approved same day with all open questions
resolved (Decisions in `.ai/specs/platform-review-findings.md`); phases were
implemented from this epic directly under Ian's blanket go-ahead. Future theme
ideas captured in `.ai/specs/theme-ideas.md`.

## Phase 1 — Stored-vars hygiene + persistence model ✅ DONE — commit 501f9ba

## Phase 2 — Default theme + value-drift check ✅ DONE — commit 501f9ba

## Phase 3 — Link/button color model ✅ DONE — commit 501f9ba

## Phase 4 — Warm-tone detector removal ✅ DONE — commit 501f9ba

## Phase 5 — Single design-vars state + honest theme swatches ✅ DONE — commit 3398624

## Phase 6 — Registry-driven control engine ✅ DONE — commit 7d7082c

## Phase 7 — Hardcoded-style sweep + font tokens ✅ DONE — commit d1d31aa

## Outcome

Stored design state is `design:v1` `{version, theme, overrides, snapshot}`
with typed guards; clean visits persist nothing; legacy keys migrate once.
`DEFAULT_THEME` (High Contrast) is programmatic and the tenth drift check
`[default-value-sync]` keeps registry, SCSS first paint, and the default theme
value-identical. Links are three-state; `color="primary"` uses
`--btn-primary-bg`. One `DesignVarsProvider`; one registry-driven
`TokenControl` engine; font families tokenized; button sizes ride the font
scale.
