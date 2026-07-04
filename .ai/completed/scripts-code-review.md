# Scripts Code Review

Reviewed: `scripts/check-no-eslint-disable.js`, `scripts/validate-doc-lines.js`  
Entry point: `package.json` `lint` script  
Date: 2026-06-22

---

## What the scripts do

### `check-no-eslint-disable.js`

Walks the repo from CWD, scans `.ts/.tsx/.js/.jsx` files for `eslint-disable`
comments, exits 1 if any are found.

### `validate-doc-lines.js`

Enforces size limits: max 25 active `.md` files, max 80/280 lines for markdown
by category, max 250 lines for all non-test code files including tooling
(data files exempt).

### Invocation chain

```
npm run check  →  format → typecheck → lint
npm run lint   →  eslint . && node scripts/check-no-eslint-disable.js
                           && node scripts/validate-doc-lines.js
                           && knip --no-config-hints
```

---

## Recommendation: merge into one `scripts/validate.ts`

The two scripts share one responsibility — validate repo structural health.
Separating them creates compounding problems:

1. **Divergent ignore configs** — three independent lists (ESLint, each script)
   drift independently. Adding a new output dir requires editing all three.
2. **Redundant tree walks** — `validate-doc-lines.js` walks 5× (once for `.md`,
   once per code extension); `check-no-eslint-disable.js` walks again. A merged
   script walks once, collecting all violations in one pass.
3. **No unified output structure** — violations should be grouped by type (see
   below). With `&&` chaining, output ordering is controlled by which script
   runs. Adding a new check type means a third script or bolting it onto
   whichever existing script feels closest — both are wrong.

Use `.ts` (not `.js` or `.mjs`) — CLAUDE.md bans new `.js` files, and the
constants benefit from type safety. Run via `tsx`, added as a devDependency.
Keep `eslint .` and `knip` as separate processes — they're external tools.

---

## Required: output structured by violation type

Violations must be bucketed so the system scales to N check types:

```
❌ Validation failed:

  [eslint-disable]  src/foo.ts:12 — eslint-disable comment not allowed
  [code-size]       src/pages/admin/preview/SomeFile.tsx: 490 lines (max 250)
  [doc-size]        .ai/specs/some-file.md: 90 lines (max 80)
  [md-count]        Too many .md files: 26 (max 25)
```

Adding a new violation type means adding a type string and a check function —
nothing else changes.

---

## Bug: self-exclusion needed in merged script

`check-no-eslint-disable.js` excludes itself because its source contains the
string `eslint-disable` (in the regex and error messages). The merged
`validate.ts` must do the same. Use `import.meta.filename` to compare the
absolute path rather than a magic string filename check.

---

## Bug: `scripts/` and config files excluded from code-size walk — shouldn't be

`validate-doc-lines.js` already scans:

- `eslint.config.js` (94 lines)
- `scripts/check-no-eslint-disable.js` (70 lines)
- `scripts/validate-doc-lines.js` (91 lines)

The 250-line limit exists because large files cause agents to miss content.
That applies to tooling scripts too — leave them in scope.

---

## Bug: `.ai/completed/` counts toward the 25-file MD limit

Completed plans are historical artifacts. They should be excluded from the
file count but remain in the repo and keep their per-file line limits enforced.
Currently 5 files in `.ai/completed/` consume 5 of 25 slots.

Fix: filter `.ai/completed/` files out of the count check only. Per-file line
limit checks still apply.

Active MD count after fix: 18/25, 7 slots of headroom.

---

## Bug: off-by-one in line count — fix it

```js
const lineCount = content.split('\n').length;
```

Files ending with `\n` (all properly-formatted files) report N+1. The constant
says `MAX_CODE_LINES = 250` but the actual enforced limit is 249. Constants
must mean what they say. This means CLAUDE.md is currently reported as 79
lines (not 78) — only 1 line of headroom before the 80-line limit trips.

Fix the off-by-one before editing CLAUDE.md, or it immediately flags.

**Fix:** `content.split('\n').length - (content.endsWith('\n') ? 1 : 0)`

---

## Bug: substring path matching (`check-no-eslint-disable.js`)

```js
ignorePatterns.some((pattern) => filePath.includes(pattern));
```

`'build'` as a substring matches `src/rebuildUtils.ts`. `'.git'` as a
substring would match a `.github/` directory (common for CI workflows) and
silently skip it. `validate-doc-lines.js` already uses the correct approach:
`excludeDirs.has(entry.name)` compares directory name segments, not substrings.

---

## Bug: `coverage` and `.firebase` missing from `validate-doc-lines.js`

| Tool                    | Ignores                                                           |
| ----------------------- | ----------------------------------------------------------------- |
| ESLint                  | `build/**`, `coverage/**`, `node_modules/**`                      |
| check-no-eslint-disable | `node_modules`, `.git`, `build`, `coverage`                       |
| validate-doc-lines      | `node_modules`, `.git`, `build` — missing `coverage`, `.firebase` |

`coverage/` is created by `npm test -- --coverage`. `.firebase/` exists at the
root and could grow. The merged script's shared ignore set must include both.

---

## Bug: ESM without `"type": "module"`

Both scripts use `import fs from 'fs'` but `package.json` has no
`"type": "module"`. Works on Node 23 (auto-detects ESM) but fails on Node 20
(what `.nvmrc` pins) without `--experimental-detect-module`. Converting to
`.ts` + `tsx` eliminates this issue entirely.

---

## Fix: CLAUDE.md hardcodes `.nvmrc` version

CLAUDE.md says "`.nvmrc` pins 18.19.0" — `.nvmrc` actually contains `20.19.0`.
Per progressive disclosure, CLAUDE.md should not repeat a version that lives
in `.nvmrc`. Remove the hardcoded version, reference the file instead.

Also add to `package.json`:

```json
"engines": { "node": ">=20.0.0" }
```

And add `.npmrc`:

```
engine-strict=true
```

Firebase deploy is local-only (static file upload, no CI pipeline) — this
change has no deployment risk.

---

## Design: no CWD validation

Both scripts use `walkDir('.')`. Wrong CWD silently scans the wrong tree.
Check for `package.json` at CWD startup to confirm correct invocation root.

---

## Near-limit warnings (post-fix state)

| Item                                   | Lines/Count | Limit | Headroom |
| -------------------------------------- | ----------- | ----- | -------- |
| Active MD file count (excl. completed) | 18          | 25    | 7 files  |
| CLAUDE.md (script-reported)            | 79          | 80    | 1 line   |
| `.ai/specs/imagebox-epic.md`           | 277         | 280   | 3 lines  |

---

## Recommended implementation order

1. Add `tsx` to devDependencies
2. Create `scripts/validate.ts` — single walk, typed violations, shared ignore set
3. Update `package.json` lint script to use `npx tsx scripts/validate.ts`
4. Delete `scripts/check-no-eslint-disable.js` and `scripts/validate-doc-lines.js`
5. Add `"type": "module"` to `package.json` (or confirm tsx handles it)
6. Add `engines` to `package.json` and create `.npmrc`
7. Update CLAUDE.md Node version reference
8. Run `npm run check` to verify
