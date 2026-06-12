# WORK.md

## Current phase

Refactor/consolidate + design system completion. The repo is live on ianrios.me and publicly inspectable. Code quality and architectural clarity are required at all times.

## Active priorities (in order)

1. ✅ **Design system: fix link/hover/active state wiring** — `.skeu-btn--outline` now gets `--link-hover`/`--link-active` colors on hover/active. `.skeu-btn--primary` overrides back to `--btn-text-color`. `Accordion.js` uses `.skeu-accordion-btn` CSS class. `NavVertical.js` link variant uses `.skeu-nav-link-btn` CSS class (no more JS hover).
2. ✅ **Design system: apply tokens to splash/MetaBalls page** — `open-link` fully token-driven, canvas scoped to `.view-1`, splash layout and color utilities in `_base.scss`.
3. ✅ **Consolidate legacy CSS** — `App.css` and `index.css` deleted. All rules migrated to `_base.scss` + `_components.scss`. `PortfolioSidebar.js` replaces inline SVGs with `Icon` atom; skills panel uses `Badge` with `href`.
4. ✅ **Design system atom/component overhaul** — Button size/style orthogonal system (xs/sm/md/lg/xl × gradient/primary/outline). Link variant system (surface/text/ghost × default/muted/accent/primary × underline). `Link.js`, `Slider.js`, `ValueInput.js` atoms added. `TokenSidebar` rewritten with accordion sections (preset/global/atom badges, reordered: motion before atoms). `DSPreview` reorganized: each atom in own section, all link combos in a matrix, button size+style separate. `PushPanel` tab now uses stacked per-character letters. "Visit Live Demo" is `skeu-btn--xs` size.
5. ✅ **Design panel wired into home page (spec items 14/15)** — `PushPanel` wraps the main view in `Home.js`. `useDesignVars` called from Home, so stored tokens apply on every page load. Tab slides in after 3 seconds (`revealDelay={3000}`).
6. ✅ **Design system project card (spec item 16)** — Added "Live Design System" card to `independentProjectsData` in `src/data.js`, linking to `/admin`.
7. **Portfolio content** — Add latest work experience and projects to `src/data.js` (requires Ian to supply content/details).
8. **V2 design exploration** — Read `.ai/specs/portfolio-overhaul.md`; implement items 6 (new job experience view), 7 (/resume path), 11/12 (animations, minimal/esoteric design).
9. **ImageBox** — Not started. See `.ai/specs/imagebox-epic.md`.

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
