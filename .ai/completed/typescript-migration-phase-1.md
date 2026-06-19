## Phase 1 — Dead code audit (knip) ✅ DONE

Ran knip against `src/index.js`. Results and actions:

**Files deleted:**

- `src/old-three/` (5 files: `example.js`, `main.js`, `threetutorial.js`, `utils.js`, `three.css`)
- `src/setupTests.js`
- `src/components/organisms/CardGrid.js` — not imported anywhere (surprise finding)
- `src/reportWebVitals.js` — imported in `index.js` but called with no callback (no-op); import and call removed from `index.js`

**Packages uninstalled (13):**
All `@react-three/*` (11 packages), `axios`, `nice-color-palettes`, `web-vitals`

**Intentionally kept despite knip flags:**

- `@testing-library/*` — flagged unused because `setupTests.js` was the entry point; upgraded in Phase 2
- `sass` — false positive; knip does not trace SCSS imports; actively used
- `three` — vendored copy lives in `src/three/`; replaced with npm import in Phase 5

**`react-three-paper` correction:** Initially uninstalled by mistake. `MetaBalls.jsx` actively imports `Paper` from it. Reinstalled.

**`src/three/` vendored files:** Live code — not dead. Knip flagged 442 unused _exports_ from the vendor bundle (the full Three.js API). Stay until Phase 5 rewrites them.

**Remaining knip findings after Phase 1** (all intentional):

- 4 unused deps (`@testing-library/*` ×3, `three`) — intentionally kept
- 1 unused devDep (`sass`) — false positive
- 442 unused exports — vendored `src/three/` files, gone in Phase 5
- 1 unlisted binary (`firebase`) — global CLI, expected

### Phase 1 — Doc update

No CLAUDE.md or `.ai/` changes needed here — dead code removal is self-evident from git history.
