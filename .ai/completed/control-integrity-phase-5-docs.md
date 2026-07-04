# Phase 5 — Docs & Close-out

Status: ✅ COMPLETE (2026-07-03). Part of `control-integrity-epic.md`.
Depends on all prior phases.

## Problem

The drift-lint contract and design facts must reflect the new end state so future
agents inherit it: 9 drift checks (added `[token-unused]`, `[token-example]`),
the Primary/Outline variant model (no Gradient/ghost-button), the removed
Elevation picker, and the grouped preview nav.

## Changes

- `CLAUDE.md` — update the drift-check list to **nine** with one terse line each;
  note the control↔effect↔example contract (every editable token must have a
  control, a real CSS consumer, and a live example); update the button-variant
  description (Primary filled + Outline bordered; no Gradient/ghost-button); note
  the grouped preview nav. Keep ≤80 lines (fold/condense as needed).
- `.ai/WORKFLOW.md` — add the control↔effect↔example rule to the Design system
  invariant (one line, referenced not duplicated).
- `.ai/ANTI-PATTERNS.md` — add: "Don't add a token without a real `var()`
  consumer AND a live preview example (`[token-unused]` / `[token-example]`)";
  "Don't simulate component states on a wrapper element — style the real element."
- `.ai/BUGS.md` — record nothing new (all fixed) or prune as needed.
- `.ai/WORK.md` — mark the Control-Integrity epic complete (absolute date); add a
  Recently-completed entry.
- Epic lifecycle: fold epic phase rows to one line each; add `✅ COMPLETE` status
  headers to the 5 sub-plans; `mv` the epic + sub-plans to `.ai/completed/`
  (watch the md-count budget — completed/ is exempt).

## Verification

- [ ] CLAUDE.md drift list = 9, accurate; ≤80 lines
- [ ] WORKFLOW/ANTI-PATTERNS updated, non-duplicated
- [ ] WORK.md + epic + sub-plans folded and moved to `.ai/completed/`
- [ ] `npm run check` green (incl. doc-size/md-count)
