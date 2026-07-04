# Phase 6 — Docs, Drift Contract & Orchestration Model

Status: ✅ COMPLETE (2026-06-30). Part of `design-system-coherence-epic.md`.
Depends on all prior phases (documents the end state). Finalize last.

## Problem statement (issue 9 process half + Ian's meta ask)

Many agents have worked here and missed cross-surface updates because the rules
lived only in prose. Phase 1 codifies the drift lint, but the docs must (a)
explain the token-registry contract so future agents extend the registry instead
of re-introducing parallel arrays, and (b) capture how Ian wants agents to
operate in this repo: **as orchestrators** — any agent Ian talks to should plan,
delegate reads/writes to subagents where useful, peer-review, and gate on his
approval. This isn't written down yet.

## Files to change and why

- `CLAUDE.md` — update structural facts: route `/admin`→`/design-system`; add a
  "Token registry is the single source of truth — add tokens there, never in a
  parallel array" rule; note the drift lint is part of `npm run check` and what
  each violation means. Update the component/route inventory for any new
  component (Switch) and renamed surfaces.
- `.ai/WORKFLOW.md` — add an **Orchestration model** section: the agent Ian
  converses with acts as orchestrator (plan → delegate to subagents for
  fan-out reads / parallel implementation → peer review → approval gate); when
  to spawn subagents vs work inline. Add the token-registry contract to the
  "Design system invariant" section.
- `.ai/ANTI-PATTERNS.md` — add: "Don't add a token to one surface only — extend
  the registry; the drift lint will fail otherwise" and "Don't hand-maintain
  DEFAULTS/control arrays in parallel with the registry."
- `.ai/BUGS.md` — remove the now-fixed "link hover not wired to all interactive
  elements" entry (superseded by Phase 3); update remaining items.
- `.ai/WORK.md` — fold the epic into the active priorities list; mark phases as
  they complete per the epic/sub-plan lifecycle.
- Epic + each sub-plan — on completion, fold the epic phase row to one line and
  add the one-line status header to each sub-plan (per WORKFLOW.md).

## Approach / reasoning

Codify what the lint can't: the _intent_ (registry-first, orchestrate-don't-
solo) so the lint and the docs reinforce each other. This is the durable fix for
"agents lack context to update all surfaces."

## Risks / tradeoffs

- Progressive-disclosure rule: each fact in one place. Put the registry contract
  in CLAUDE.md (structural) and reference it from WORKFLOW/ANTI-PATTERNS, don't
  duplicate.

## Verification checklist

- [ ] CLAUDE.md route/inventory/registry facts accurate to shipped code
- [ ] WORKFLOW.md orchestration model + registry contract present, non-duplicated
- [ ] ANTI-PATTERNS.md registry entries added
- [ ] BUGS.md stale entries removed
- [ ] WORK.md priorities list updated; epic + sub-plans folded per lifecycle
- [ ] `npm run check` (incl. validate.ts doc-size/md-count) green
