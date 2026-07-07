# Agent Workflow

## Progressive disclosure

One fact in one file; never duplicate across docs or restate what source
files show — infer it. Write docs only for non-obvious constraints, external
causes, and things that burned time before.

## Planning convention

Required for any task with more than 2–3 file changes:

1. Problem statement
2. Files to change and why
3. Approach and architectural reasoning
4. Risks / tradeoffs
5. Verification checklist

Plans name CLI commands. Plans do not contain source code or config file
contents. Planning agents do not write code.

## Orchestration model

The agent Ian talks to acts as an **orchestrator**, not a solo implementer:
plan → delegate → peer-review → gate on Ian's approval. Do synthesis, plans,
and final review yourself; work inline for small single-surface edits. Scoped
implementation with a precise brief goes to a lower-power-model subagent with
an explicit file allowlist (shared files = conflicts); subagents start cold,
verify with the repo gates, and never commit.

## Epics and sub-plans

Sub-plans live in `.ai/plans/<epic-slug>-phase-<n>-<short-name>.md`.

When a phase is done, replace the **entire** phase section in the epic
with one line: `## Phase N — Name ✅ DONE — see .ai/plans/<file>.md`
Mark the sub-plan complete with a one-line status header at the top.
Do not delete sub-plan files — they are the permanent record.

## Peer review (mandatory)

Every plan: spawn a zero-context subagent with only the plan + relevant
source files. Ask it to report gaps, missing wiring, stale assumptions,
and ambiguities only Ian can resolve. Fold real findings into the plan.

## Human approval gate

New epics and direction changes: present Ian a skimmable summary and wait
for explicit approval (`.ai/ANTI-PATTERNS.md` lists what does NOT count).
Phases inside an approved epic proceed WITHOUT asking (Ian, 2026-07-07) —
he steers by reviewing the dev server and diffs. Bring him genuine gaps
(decisions only he can make, stated as such); progress check-ins are noise.

## Verification

Run `npm run check`, `npm run build`, `npm test`. Passing automated checks
is not the same as done. Visual / behavioral confirmation requires Ian's
review directly.

## Doc updates (at each phase close)

1. Fold epic phase to one line (entire section replaced — no old content)
2. Mark sub-plan complete with one-line status header
3. Update `.ai/WORK.md` only if the current phase, priorities, or open
   questions changed — completed work is never listed there
4. Update `CLAUDE.md` if any structural facts changed

## Design system invariant

All new code: CSS custom properties for colors / spacing / radii / shadows,
atoms from `src/components/atoms/`, `skeu-*` class names from the tier
partials under `src/styles/components/`. No hardcoded values. No Bootstrap.

Tokens have one source of truth: `src/styles/token-registry.ts` — add/change
tokens there, never in a parallel array. Every editable token needs a control,
a real CSS effect, and a live preview example (control↔effect↔example; the
drift checks listed in `CLAUDE.md` gate `npm run check`).

Every component in `src/components/` needs an accurate demo in the grouped preview
nav under `src/pages/admin/preview/` (`demo-missing` check) — stale demos are bugs.
