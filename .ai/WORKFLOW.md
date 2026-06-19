# Agent Workflow

## Progressive disclosure

One fact in one file. Never duplicate across docs. Don't restate what's
in source files or config — infer it. Write docs only for: non-obvious
constraints, external causes, things that burned time before.

## Planning convention

Required for any task with more than 2–3 file changes:

1. Problem statement
2. Files to change and why
3. Approach and architectural reasoning
4. Risks / tradeoffs
5. Verification checklist

Plans name CLI commands. Plans do not contain source code or config file
contents. Planning agents do not write code.

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

After peer review: present Ian a skimmable chat summary. Wait for explicit
approval. Do not start implementing without an unambiguous go-ahead.
See `.ai/ANTI-PATTERNS.md` for what does NOT count as approval.

## Verification

Run `npm run check`, `npm run build`, `npm test`. Passing automated checks
is not the same as done. Visual / behavioral confirmation requires Ian's
review directly.

## Doc updates (after Ian confirms done)

1. Fold epic phase to one line (entire section replaced — no old content)
2. Mark sub-plan complete with one-line status header
3. Update `.ai/WORK.md` active priorities list — mark ✅, add next phase
4. Update `CLAUDE.md` if any structural facts changed

## Design system invariant

All new code: CSS custom properties for colors / spacing / radii / shadows.
Atoms from `src/components/atoms/`. `skeu-*` class names from
`_components.scss`. No hardcoded values. No Bootstrap classes.

## Anti-patterns

See `.ai/ANTI-PATTERNS.md` — failures requiring multiple steering corrections.
