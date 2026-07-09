# Phase 6 — Cursor + texture effects (admin-configurable)

Status: ✅ DONE — implemented, all checks green (98 tests incl. the
themes-completeness test that forces both tokens into all 9 themes).

## Outcome + peer review findings folded in

- Review corrections applied: theme completeness is enforced by the
  `ThemeSpec` type + `themes.test.ts`, not the drift checks the draft
  cited; `TokenSidebar.tsx` (composition site) got the Effects section
  directly via the registry-driven `vn('effects')` list; TextureOverlay
  gained an `inline` contained swatch (with a CSS `max()` visibility
  floor so the demo reads even at token 0)
- Review's `[md-count]` catch (25/25 full) fixed by a process change:
  completed sub-plans now move to `.ai/completed/` at phase close
  (permanent record kept, budget slot freed) — phases 1-5 + cookie
  consent moved, epic links updated
- z-order decision: grain 2000 above all UI (it is a filter), cursor
  ring 2100 above grain; both have `view-transition-name` so page pans
  slide beneath them
- Theme values: High Contrast/Classic Bevel stay 0/off (purist), Terminal
  gets green-CRT grain 0.08 + 14px ring, Brutalist harsh grain no ring,
  Glow/Pillow/Soft Neu rings only, Maximal everything on

## Problem statement

Original spec items 19 (cool cursor) and 20 (texture filter) require
admin-configurable effects; item 5 wants pointer-reactive texture motion.
Nothing exists today. "Admin-configurable" in this repo means REAL
registry tokens: control + CSS effect + live example + all nine THEMES
set them (drift-check enforced), not a bolted-on settings panel.

## Scope decisions

- **Two new editable tokens, one new `effects` category:**
  - `--cursor-fx-size` (range px, 0-48, default `0px` = off) — size of a
    pointer-trailing ring; the High Contrast default stays purist, playful
    themes opt in
  - `--texture-opacity` (raw 0-0.4 step 0.02, default `0` = off) — film
    grain overlay (SVG feTurbulence data URI), CRT-adjacent, on-brand for
    the Win95 language
- **Pointer parallax is texture behavior, not a token** — the grain layer
  drifts subtly against pointer movement; tokenizing the factor is cascade
  cost with no design payoff today
- **True WebGL/three.js hover shaders are NOT this phase** — three.js
  stays out of the entry chunk (it cost real work to get it lazy).
  Backlogged with rationale in `.ai/specs/webgl-effects.md`
- Both effects disable under `prefers-reduced-motion` and on
  `(hover: none)` touch devices (cursor ring is meaningless there)

## Files to change and why

- `src/styles/_tokens.scss` + `_base.scss` — `$cursor-fx-size: 0px`,
  `$texture-opacity: 0` and their `:root` vars (first-paint literals must
  equal registry defaults, [default-value-sync])
- `src/styles/token-registry.ts` — `'effects'` in `TokenCategory`, two
  entries with controls
- `src/pages/admin/adminData.ts` — every THEME sets both tokens
  ([theme-control]/[preset-token]); High Contrast `0px`/`0`, themed
  values elsewhere (e.g. subtle grain on retro-flavored themes)
- `src/pages/admin/TokenSidebarExtra.tsx` (or the sidebar section list) —
  new Effects section rendering the `effects` controls via the existing
  registry-driven engine
- `scripts/drift-checks.ts` — `'effects'` joins COMPONENT_DEMO_CATEGORIES
  (live component demos, no swatch specimen)
- **New: `src/components/organisms/CursorFX.tsx`** — fixed ring following
  the pointer via rAF + transform, sized by `var(--cursor-fx-size)`;
  renders null when size is 0 / reduced motion / no hover support;
  `inline` prop for the admin demo (FloatingNav precedent)
- **New: `src/components/organisms/TextureOverlay.tsx`** — fixed
  pointer-events-none grain layer, `opacity: var(--texture-opacity)`,
  subtle pointer parallax, own `view-transition-name` so it does not pan
  with pages
- `src/App.tsx` — mount both at root
- `src/pages/admin/preview/OrganismsSection.tsx` — demos for both with
  copy pointing at the Effects controls
- `src/styles/components/_organisms.scss` — both components' styles
  (the var() consumers [token-unused] requires)
- **New: `.ai/specs/webgl-effects.md`** — backlog spec for item 5's full
  WebGL scope
- `CLAUDE.md` — organisms list gains CursorFX, TextureOverlay

## Risks / tradeoffs

- Defaults are 0/off, so the High Contrast first paint is unchanged — but
  it also means Ian must flip a control (or switch themes) to see
  anything; demo copy must say so explicitly
- rAF pointer tracking is cheap but must not run when the effect is off —
  gate on the resolved token value from `useDesignVars`, not just CSS
- Grain overlay above everything (high z-index) must stay pointer-events:
  none and opacity-capped (0.4) so text stays readable at max
- Two tokens x 9 themes x 3 sync surfaces is exactly the kind of cascade
  the drift checks exist for — expect [default-value-sync] to complain
  until all three literals agree

## Verification checklist

- `npm run check` (all drift checks), `npm run build`, `npm test`
- Dev server: Effects section appears in the sidebar; raising Texture
  grain shows grain everywhere incl. during page pans (held still);
  raising Cursor trail size shows the ring tracking the pointer, and 0
  removes the listener (no rAF in Performance tab); themes flip both
