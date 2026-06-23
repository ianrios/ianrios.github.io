# TypeScript Migration Spec

## Goal

Migrate the full repo from CRA + plain JS to Vite + TypeScript with petal-grade strictness. Motivation: agents write better code under strict types; this is the constraint that enforces production quality going forward.

## Scope

All files in `src/`. No exclusions. `src/three/` rewritten as a proper React route. Dead files deleted after knip confirms them.

---

## Phase 1 — Dead code audit (knip) ✅ DONE

## Phase 2 — CRA → Vite + React 18 + test infrastructure ✅ DONE

## Phase 3 — TypeScript config ✅ DONE — see `.ai/plans/typescript-migration-phase-3-tsconfig.md`

---

## Phase 4 — ESLint + Prettier + enforcement scripts ✅ DONE — see `.ai/plans/typescript-migration-phase-4-eslint-prettier.md`

---

## Phase 5 — File conversion (bottom-up) ✅ DONE — see `.ai/completed/typescript-migration-phase-5-file-conversion.md`

---

## Phase 6 — Post-migration cleanup verification ✅ DONE

`find src -name "*.jsx"` and `find src -name "*.js"` both return nothing. `vite.config.ts` reverted to plain `react()`. CLAUDE.md updated to remove `.jsx`/Group 14 stale references.

---

## Phase 7 — Verification gate

All must pass before the migration is done:

```bash
npm run typecheck   # zero errors
npm run lint        # zero warnings, no eslint-disable, no knip findings
npm run build       # clean output, deploys correctly to Firebase
npm test            # all passing under Vitest
find src -name "*.jsx" -o -name "*.js" # must return nothing
```

### Phase 7 — Doc update

Update `CLAUDE.md` fully to reflect the completed migration: TypeScript throughout, Vite, Vitest, strict ESLint. Update `.ai/WORK.md` with migration complete. Archive or close this spec.
