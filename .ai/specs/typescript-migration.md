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

## Phase 6 — Post-migration `.jsx` cleanup verification

After Phase 5, no `.jsx` files should remain anywhere in `src/`. Run:

```bash
find src -name "*.jsx" # must return nothing
find src -name "*.js"  # must return nothing (src/three/ vendored files are gone)
```

Also clean up `vite.config.ts`: remove the `include: /\.[jt]sx?$/` override from the react plugin — it was only needed to handle JSX in `.js` files during the intermediate state. Revert to `react()`.

### Phase 6 — Doc update

Update `.ai/specs/typescript-migration.md` Phase 2 stubbed-toe note: confirm resolved. Update CLAUDE.md to remove any remaining references to `.jsx`.

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
