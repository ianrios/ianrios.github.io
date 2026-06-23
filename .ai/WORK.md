# WORK.md

## Current phase

TypeScript migration (`.ai/specs/typescript-migration.md`). Phases 1–6 complete. Phase 7 (verification gate: deploy confirm) is next.

## Active priorities (in order)

### TypeScript migration (epic: `.ai/specs/typescript-migration.md`)

1. ✅ **Phase 1 — Dead code audit (knip)** — old-three/, setupTests.js, CardGrid.js, reportWebVitals.js deleted; 13 packages uninstalled.
2. ✅ **Phase 2 — CRA → Vite + React 18 + test infrastructure** — Vite 8, React 18, Vitest, all .js renamed to .jsx.
3. ✅ **Phase 3 — TypeScript config** — `typescript` installed, `tsconfig.json` added with full strict config.
4. ✅ **Phase 4 — ESLint + Prettier + enforcement scripts** — `eslint.config.js`, `.prettierrc.json`, `scripts/`, `npm run check` canonical.
5. ✅ **Phase 5 — File conversion + Group 14** — all `.jsx`→`.tsx`/`.ts`; `src/three/` vendored files deleted, `ThreeScene.tsx` written using npm `three`; `npm run check` green.
6. ✅ **Phase 6 — Post-migration cleanup** — `find src -name "*.jsx"` returns nothing; `vite.config.ts` reverted to plain `react()`; CLAUDE.md stale references removed.
7. **Phase 7 — Verification gate** — deploy to Firebase, confirm site live at ianrios.me.

### Pending (lower priority, unblocked by migration)

8. **Portfolio content** — Add latest work experience and projects to `src/data.ts` (requires Ian to supply content/details).
9. **V2 design exploration** — Read `.ai/specs/portfolio-overhaul.md`; implement items 6 (new job experience view), 7 (/resume path), 11/12 (animations, minimal/esoteric design).
10. **ImageBox** — Not started. See `.ai/specs/imagebox-epic.md`.

## Recently completed (this session)

- Removed `--surface-link-bg`, `--surface-link-bg-accent`, `--surface-link-bg-muted` tokens — card variants derive bg via CSS cascade descendant selectors instead
- `ColorPicker.js` atom added; `_components.scss` `.skeu-color-picker` uses `--border-color`, `--radius-sm`, `--link-hover`, `--link-active`
- `TokenSidebar`: `ColorControl` and `ShadowControl` use `ColorPicker` atom; Links section corrected (default = anchors only, hover/active = all interactive); surface-link-bg subgroup removed
- `.skeu-card` hover motion removed — cards are containers not clickable; hover transform/transition stripped
- `.skeu-push-tab` `&:active` state added (was missing)
- Text color audit: all `opacity: X` + `color-text` combinations replaced with `color-muted` across `AdminUI.js`, `DSPreview.js`, `TokenSidebar.js` — system is now exactly two text colors: `--color-text` + `--color-muted`
- `DSPreview.js` "Card — surface actions": replaced pop-shadow `Button variant="outline"` with `skeu-link skeu-btn--xs` surface links that blend into card bg
- `DSPreview.js` `ColorPicker` atom showcase section added (Atoms tier)
- `adminData.js`: Terminal preset primary button gradient updated (bright green fill, dark text) so it's visually distinct from outline button

## Not in scope right now

- Playwright / e2e tests
- Backend or API of any kind
- Paid services

## Open questions

- Animations: what should animate on the splash page vs main page?
- Mobile drawer: should it use the design system's `PushPanel` organism or stay as-is?
- V2: which spec direction wins? (see `.ai/specs/portfolio-overhaul.md`)
