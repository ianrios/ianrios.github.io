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

No code in plans — plans describe what and why, not how.

## Design system invariant

Every piece of new code must:
- Use CSS custom properties from `_base.scss` for colors, spacing, radii, shadows
- Use atoms from `src/components/atoms/` before inventing new markup patterns
- Use `skeu-*` class names from `_components.scss` for component styling
- Never hardcode colors, spacing, or shadows
- Never introduce new Bootstrap classes

If a design token or atom doesn't exist for what you need, add it to the system first — don't work around it.
