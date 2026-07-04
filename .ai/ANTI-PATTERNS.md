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

**Creating or modifying a component without updating its admin demo is
incomplete work.** Every component in `src/components/` must have an accurate
demo in the matching `src/pages/admin/preview/` section (atoms → AtomsSection,
molecules → MoleculesSection, organisms → OrganismsSection). The admin panel
is the live design-system reference — stale demos are bugs.

**Add tokens to the registry, not a parallel array.** `token-registry.ts` is
the single source of truth; hand-maintaining a second DEFAULTS/control list
makes the `npm run check` drift checks fail.

**Every token a theme writes needs a control.** A `THEMES` entry that sets a
token with no editable sidebar control fails the `theme-control` drift check.

**Don't add a token without a real `var()` consumer AND a live preview
example.** An editable token needs a control, a real CSS effect, and a visible
example — a control that changes nothing (or has no example) fails
`token-unused` / `token-example`.

**Don't simulate a component's states on a wrapper element — style the real
element.** Painting a bevel/hover/press on a surrounding `div` instead of the
button itself produces the wrong shape and drifts from reality. Style the
actual element (the button-state-rectangle bug).
