# Epic: Platform, Deploy & Docs Hygiene

Status: ✅ COMPLETE 2026-07-07. Approved 2026-07-06 (decisions: analytics kept
via modular SDK; no dashes in copy, absolute; SCSS restructured into
tier-scoped partials; "Previous Co" labeled sample data; README describes the
real repo); implemented from this epic directly under Ian's blanket go-ahead.

## Phase 1 — Verification gates + budget policy ✅ DONE — commit 0c0c050

## Phase 1b — SCSS @use migration + per-tier split ✅ DONE — commit: this close-out commit

## Phase 2 — index.html modernization ✅ DONE — commit 0c0c050

## Phase 3 — Copy + content sweep ✅ DONE — commit 0c0c050

## Phase 4 — Context docs + agent ergonomics ✅ DONE — commit 0c0c050

## Outcome

`npm run deploy` is gated on check + test + build. Configs are type-checked.
Firebase analytics loads lazily via the modular npm SDK (no CDN scripts).
Production copy is dash-free with the rule in RULES.md; README and CONTEXT.md
describe the real repo. `src/styles/` is `@use`-based tier partials
(atoms / atoms-button / molecules / organisms / pages / admin / admin-preview,
all under the new 600-line SCSS budget) with byte-equivalent built CSS.
The validate.ts data-file exemption is an explicit allowlist and the drift
scaffold is gone.
