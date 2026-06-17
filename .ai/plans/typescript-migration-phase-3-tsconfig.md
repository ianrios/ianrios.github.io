# Sub-plan: typescript-migration Phase 3 — TypeScript config ✅ DONE

**Outcome:** `typescript` installed, `tsconfig.json` created with full strict
config. `npm run typecheck` runs and reports exactly one expected error:
`src/main.tsx` TS7016 on `./App` (App.jsx has no type declarations until
Phase 5). `npm run build` unaffected. `vitest` upgraded 3→4 to fix a
pre-existing major version mismatch with `@vitest/coverage-v8` that blocked
`npm install`.

Epic: `.ai/specs/typescript-migration.md` (Phase 3)

## Problem

`npm run typecheck` is defined in `package.json` as `tsc --noEmit`, but
there is no `tsconfig.json` in the repo and the `typescript` package itself
is not installed in `devDependencies` (verified: `node_modules/typescript`
and `node_modules/.bin/tsc` are both absent). The typecheck script
currently cannot run at all. This is a gap left over from Phase 2 that
Phase 3 must close before strict-mode config has anything to apply to.

## Decisions made (pre-implementation)

- `allowJs` will not be set. `src/main.tsx` imports `./App` (only `App.jsx`
  exists), so `tsc --noEmit` will report exactly one expected error on that
  import until Phase 5 converts `App.jsx`. Phase 3 "done" means: config
  exists, tsc runs, the only failure is that single known import. Accepted.
- TypeScript version: latest stable via `npm install`. No pin required.

## Files affected

- `package.json` + `package-lock.json` — `typescript` added to
  `devDependencies` via CLI.
- `tsconfig.json` (new, repo root) — strict compiler options per the epic
  spec Phase 3 block. Reference `~/Sites/petal/apps/web/tsconfig.json` for
  the proven option set; the exact fields are listed in the epic spec, not
  here.
- `CLAUDE.md` — already documents "typecheck is separate from build" in the
  Known gotchas section; no change needed. Verify during implementation.

## Approach

1. `npm install --save-dev typescript` — installs tsc into the project;
   npm picks current stable.
2. `npx tsc --init` as a starting point, then replace the generated file
   contents with the strict block from the epic spec (no comments, no
   defaults — only the options listed there). The `tsc --init` output is
   discarded; what matters is the final file matching the spec exactly.
3. Run `npm run typecheck` — expect exactly one error (unresolved `./App`
   import in `main.tsx`). Any additional errors are unexpected and must be
   investigated before marking this phase done.
4. Run `npm run build` — must still succeed (Vite ignores types).

No source files touched. No `.jsx` → `.tsx` conversions — that is Phase 5.

## Verification

- `npm run typecheck` runs (not "command not found" / no tsconfig).
- The only error reported is `main.tsx` Cannot find module `'./App'`.
- `npm run build` succeeds.
- Diff contains only `package.json`, `package-lock.json`, `tsconfig.json`.

## Doc updates on close

- Add status note to epic spec Phase 3 section.
- Update `.ai/WORK.md` if priorities shift.
