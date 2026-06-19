# Anti-patterns

Failures that have each required multiple steering corrections. Do not repeat them.

**"One-line status note" means replacing the section, not adding a header.**
Writing a ✅ DONE header above old spec content is not folding. The entire
phase section is replaced by one line. Read the epic section after editing
and confirm there is exactly one line for that phase.

**Updating WORK.md's "Current phase" header is not updating the priorities
list.** The priorities list is what agents act on. Always update it: mark
completed phases ✅, add the next phase as active.

**Do not declare a phase done after automated checks pass.** `npm run check`
/ `npm run build` / `npm test` are necessary but not the finish line. Doc
updates (epic one-liner, sub-plan status header, WORK.md list, CLAUDE.md)
must all be complete before anything is ✅ DONE.

**Do not skip CLI tool steps specified in the plan and write files directly.**
If the plan says `npx tsc --init`, run it. If it says `npm install X`, run
it. Do not use the Write tool to bypass a step the plan named.

**Do not explain Ian's instructions back to him when corrected.** Fix the
problem, say what you fixed, move on.

**When Ian steers mid-session, immediately update .ai/ docs — not
implementation files.** Config files (knip.json, package.json, etc.) belong
in the implementation step after plan approval. Touching them before approval
bypasses the plan gate.

**"Whatever is better" or "I don't have a preference" is not plan approval.**
Explicit approval means Ian says "go ahead", "approved", "do it", or
equivalent. Clarifications and steering are not approval.

**Copy config files and scripts from petal before generating from scratch.**
Petal lives at `/Users/ianrios/Sites/petal`. Use `cp` then `Edit`.
Never Read → Write to recreate a file that already exists elsewhere.

**Verify CLAUDE.md claims against reality during implementation.**
If implementation changes something, CLAUDE.md must reflect the new reality —
not the pre-implementation assumption.
