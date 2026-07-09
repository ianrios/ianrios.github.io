# Phase 2 — Theme interpolation dial

Part of `.ai/plans/visitor-theming-epic.md`. One of the 3 W3 items already
flagged as deferred in `.ai/completed/portfolio-v2-followups.md` /
`.ai/WORK.md`.

## Problem statement

Replace/augment the discrete theme `Select` (`PresetSelect`, used in both
`FunPanel` and the full `TokenSidebar`) with a dial that blends numerically
between two adjacent presets: colors interpolate in HSL, px/ms/unitless
values interpolate linearly. theme-ideas.md's constraint: themes must stay
"complete" (every editable token set) — already enforced by the
`preset-token`/`theme-control` drift checks, so no source data changes are
needed there.

## Files to change and why

- `src/styles/token-registry.ts` (read-only reference) — every editable/
  theme-settable token's control type is `color`, `range`, `ms`, `pct`, or
  `raw`-with-numeric-`min`/`max`, so every value is a number-with-optional-
  unit or a color. `--font-family-*` tokens have no `control`, so themes
  never write them and interpolation never touches them.
  **Correction from the original draft, verified against `adminData.ts`**:
  `color`-type is NOT always hex. `--border-color` and `--overlay-bg` are
  `rgba(r, g, b, a)` strings in all 9 `theme()` calls, never hex.
  `--focus-ring-color` is mixed: hex in 3 themes (Brutalist, High Contrast,
  Maximal), `rgba(...)` in the other 6. A hex-only blend function will
  throw, produce garbage, or silently snap these 3 tokens to a fallback
  color mid-drag — this is exactly the failure mode the codebase already
  guards against elsewhere (`colorUtils.ts`'s `hexToRgb`/`isHexColor`
  exist because the native `<input type=color>` can't render rgba, and
  `TokenControls.tsx`'s `ColorRow` already falls back to `'#000000'` for
  non-hex input). The interpolation utility must parse and lerp both hex
  and `rgba(...)` inputs, including the alpha channel, not just hex.
- New utility module (e.g. `src/pages/admin/themeInterpolate.ts`) — two
  pure functions: a color blend that accepts both `#hex` and `rgba(...)`
  input (parse each to an `[r,g,b,a]` tuple, blend in that space or convert
  to HSL first if hue blending is preferred, re-serialize to whichever
  format the two endpoints agree on or always to `rgba(...)` for
  simplicity), and a numeric-with-unit blend (parse leading float +
  preserve trailing unit string). Both take `(a: string, b: string, t:
number) => string`. Pure/testable in isolation — this is the only
  genuinely new logic in this phase.
- `src/pages/FunPanel.tsx` — add a "Theme blend" control: two theme
  pickers (from/to, reusing the underlying `Select` atom directly — NOT
  the `PresetSelect` molecule, which is coupled to a single globally-active
  theme via its `vars`-based dirty check and swatches, and doesn't fit a
  from/to pair) plus a
  `Slider` (0-100, same pattern as the existing Depth/Roundness/Tempo/Type
  scale masters) that calls `setVar` for every key in the union of the two
  themes' `vars`, blended via the new utility functions at the slider's
  `t`. This mirrors the existing master-dial pattern already in
  `FunPanel.tsx` (`applyDepth`/`applyRound`/etc.) rather than inventing a
  new widget type — recommended over building a literal circular "dial"
  control, since theme-ideas.md's "dial" is describing the _interaction_
  (a single control blending two endpoints), not literally requiring new
  dial-shaped UI, and the existing slider-as-master pattern is already
  proven in this exact panel.
- `src/hooks/DesignVarsProvider.tsx` / `src/pages/admin/designStorage.ts` —
  state-model question (see Risks): blending sets ~50 tokens as
  `overrides` at once, which is more than the current override model was
  designed for (today overrides represent a handful of intentional
  one-off edits against a base theme). Needs a decision on what
  `state.theme` becomes while the dial is mid-blend (`null`, since neither
  endpoint theme is exactly active?) and whether `PresetSelect`'s existing
  "Modified \*" dirty indicator should show. No code changes here until that
  model is confirmed — see Risks.

## Approach and architectural reasoning

Reuse the existing override mechanism (`setVar` per token) rather than
building a parallel "blend state" — every token the dial touches already
has a well-defined identity and a `setVar` call already exists to write it.
This keeps persistence, undo (setVar's existing "editing back to the
theme's own value clears the override" logic), and the flash-script
snapshot replay all working unmodified, since they all operate on the
resolved `vars` map regardless of how a given value was produced.

## Risks / tradeoffs

- **This is the largest phase across both epics.** It's new interpolation
  math (untested in this codebase), a new control surface, and a state-
  model question (what does "active theme" mean mid-blend) that the
  existing `DesignState` shape (`{ theme: string | null, overrides:
CSSTokenMap }`) wasn't designed around. Recommend treating the first
  implementation pass as a prototype Ian reviews live before it's
  considered done, not a one-shot build.
- Dragging the dial continuously calls `setVar` ~50 times per position
  change, each of which re-renders and re-persists (existing
  `useLayoutEffect` persist-on-every-vars-change behavior) — the existing
  master sliders in `FunPanel` already do this at smaller scale (4-6 vars
  each) without visible jank, but 50 vars per tick is untested; may need
  debouncing the `localStorage` write (not the visual update) if it's
  janky in practice.
- Color interpolation in HSL can produce muddy intermediate hues for colors
  far apart on the wheel (a known HSL-lerp artifact) — acceptable for
  "blend two hand-picked adjacent presets" per the spec's framing, but
  worth Ian eyeballing a few theme pairs, not just adjacent-looking ones.
- Scope, decided (Ian 2026-07-09): `FunPanel` only, not the full
  `TokenSidebar` (`/design-system`) — `TokenSidebar` already exposes every
  token individually and a blend control there would compete with, not
  complement, that granularity.

## Verification checklist

- `npm run check`, `npm test`, `npm run build`
- Unit tests for the new interpolation utility (color + numeric-with-unit
  cases, including edge cases like blending a theme against itself at
  t=0/t=1 exactly reproducing the endpoint values)
- Manual: `npm run dev -- --port 3001`, drag the blend slider across its
  full range between several theme pairs, confirm colors and geometry blend
  smoothly, confirm a reload mid-blend-position reproduces the same look
  (snapshot replay), confirm returning to an exact endpoint (t=0 or t=100)
  matches that theme's values exactly (no residual override drift).
