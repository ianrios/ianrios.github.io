# Agent Workflow

## Operating model

**Ian owns:** Product direction, architecture, visual taste, scope, code review, deployment  
**Agents own:** Implementation, scaffolding, refactors, docs, research, testing

## Session startup protocol

Do this in order before writing a single line of code:

1. Read `CLAUDE.md` → `.ai/CONTEXT.md` → `.ai/WORK.md` → `.ai/RULES.md`
2. Read any relevant specs in `.ai/specs/`
3. Scan `src/components/` and `src/styles/` for current system state
4. Synthesize what you found: phase, active focus, open issues, tech debt visible in code
5. Propose a plan — scope, which files change, why, verification approach
6. Spawn a peer-review subagent (no prior context) with the plan, relevant source files, and specs. Instruct it to report only real gaps — missing wiring, ambiguity that would stall execution, risks. Patch findings into the plan.
7. Present the synthesized plan to Ian. Ask one clarifying question if something is genuinely ambiguous after all the above. Not multiple. Not none if something is actually unclear.
8. After Ian approves: execute, verify (`npm run build` + `npm test -- --watchAll=false`), report what changed

## End of session

1. Update `.ai/WORK.md` — move completed items, add new items in flight, note open questions
2. Update `CLAUDE.md` if any structural facts changed (new components, new routes, new constraints)
3. Update the relevant spec in `.ai/specs/` if spec goals were met or decisions were made

## Progressive disclosure

- Never duplicate information across files. Each fact lives in one place.
- Don't restate what's in `package.json`, `data.js`, or any other source of truth — infer it.
- Don't add comments that explain what code does — code should be self-documenting.
- Don't write docs that an agent can derive by reading the code in under 60 seconds.
- Do write docs for: non-obvious decisions, constraints with external causes, things that burned time before.

## Planning convention

Before implementing any task of more than 2-3 file changes:
1. State the problem (not just the symptom)
2. List every file to be changed and why
3. Describe the approach and architectural reasoning
4. Note any risks or tradeoffs
5. Define the verification checklist
6. Peer-review via subagent (see startup protocol step 6)

Plans describe what and why. Implementation steps should name the specific
CLI commands that will be run (e.g. `npm install --save-dev typescript`,
`npx tsc --init`) — this is the right level of precision. What plans must
not contain is source code or config file contents; reference the target
file or folder path instead so there is no copy to drift.

For all package management and tooling setup, agents must use CLI tools,
not manually edit files like `package.json` or lock files directly.

Planning agents do not write code. A plan is a document, never a patch.

## Epics and sub-plans

A spec in `.ai/specs/` can be an **epic**: a multi-phase body of work
completed across many sessions by many different agents (e.g.
`typescript-migration.md`). Epics describe the phases, their order, and the
target end-state. They do not carry full task-by-task planning detail for
every phase — that would bloat the file and rot as phases complete.

When an agent picks up the next unfinished phase of an epic:
1. Create a **sub-plan** file for that phase's actual task plan. Sub-plans
   live in `.ai/plans/`, named `<epic-slug>-phase-<n>-<short-name>.md`.
2. The sub-plan follows the planning convention above (problem, files,
   approach, risks, verification) and links back to the epic file by name —
   it does not restate epic content.
3. Peer-review the sub-plan via a zero-context subagent (see below).
4. Once the phase is implemented and verified, fold only the essential
   outcome (what changed, what was decided, any gotchas) back into the epic
   file as a short status note, and mark the sub-plan file itself complete
   (a one-line status header is enough). Do not delete sub-plan files —
   they are the persisted record of what was done and why, kept in git
   alongside the code they describe. The epic stays small by only ever
   holding a short pointer/summary per phase; the sub-plan in `.ai/plans/`
   holds the full reasoning permanently.

This convention applies to any future epic, not just the TypeScript
migration — document new epics the same way.

## Peer review (mandatory for every plan file)

Every plan or sub-plan file, with no exceptions, must be peer-reviewed by a
subagent spawned with **zero prior context** before it is presented to Ian.
Hand the subagent only the plan file plus whatever source files/specs it
needs to evaluate it — not the conversation history. Instruct it to report:
- gaps or missing wiring
- assumptions that only Ian can resolve
- inconsistencies between the plan and the current repo state (e.g. a plan
  built on a stale assumption about what's already done)

Fold real findings back into the plan before showing it to Ian.

## Human approval gate

After peer review and after any open questions are answered:
1. Present Ian a skimmable chat summary (a few sentences to a short list) —
   not the full plan file dump — so he can decide whether to read the rest.
2. Wait for explicit approval. Do not start implementing on an assumed yes.
3. Only after approval may any agent begin writing code for that plan.

## Verification after implementation

- Run whatever the repo's tooling can check automatically: `npm run
  typecheck`, `npm run lint`, `npm run build`, `npm test`. Do this for every
  change where it applies — it's free signal.
- Passing these checks is not the same as the task being done. Never report
  a task complete on the strength of automated checks alone.
- Anything that requires visual or behavioral confirmation in a real browser
  must be verified by Ian directly. Do not use Playwright or similar
  browser-automation tools as a substitute for his review — they are too
  low-fidelity to stand in for human QA on this project.
- Wait for Ian's explicit confirmation before considering the task closed.

## Doc updates after a plan closes

Once Ian confirms a task is done:
1. Mark the sub-plan complete (or delete it per the epic/sub-plan rule above
   after folding its outcome into the epic).
2. Update `.ai/WORK.md` — move completed items, add anything newly in
   flight.
3. Update `CLAUDE.md` or extract a new file under `.ai/` for any finding
   that future agents need and isn't already documented.
4. If Ian corrects your process mid-session (steering), update the relevant
   `.ai/` files immediately, in that same turn — before continuing the
   original task. The goal is that no future agent, in this session or a
   later one, re-derives a correction Ian already gave once.

## Design system invariant

Every piece of new code must:
- Use CSS custom properties from `_base.scss` for colors, spacing, radii, shadows
- Use atoms from `src/components/atoms/` before inventing new markup patterns
- Use `skeu-*` class names from `_components.scss` for component styling
- Never hardcode colors, spacing, or shadows
- Never introduce new Bootstrap classes

If a design token or atom doesn't exist for what you need, add it to the system first — don't work around it.
