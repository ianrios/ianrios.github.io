# Phase 3 — Cursor + texture system

Status: ✅ DONE (2026-07-09) — all checks green. Item #5's root cause
confirmed as "effect off site-wide by default" (not a splash-specific
bug); default theme's cursor visibility left unchanged, out of scope.
Texture fix used `mix-blend-mode: overlay` plus a lowered `--texture-opacity`
ceiling (0.4 → 0.3) and a softened reactive-blob falloff.

Part of `.ai/plans/frontend-nits-epic.md`. Covers frontend-nits.md items
#2, #3, #4, #5, #7, #8, #9, #10. Independent of every other phase.

## Problem statement

`CursorFX` and `TextureOverlay` (root-mounted in `App.tsx`, active on every
route) currently only track pointer position — there is no hover state, no
click/active state, and no enforced minimum size relationship between the
cursor dot and its trail ring. Texture intensity at the high end of its
range is too dark. One item (#5) is a suspected bug on the splash page, not
a tuning request.

## Files to change and why

- `src/components/organisms/CursorFX.tsx` — items #3, #4: add global
  `pointerover`/`pointerout` listeners (delegated at `window`, filtering
  for interactive targets — buttons, links, `[role="button"]`, inputs,
  sliders) to toggle a `.skeu-cursor-dot--hover`/`--trail-hover` state, and
  `pointerdown`/`pointerup` listeners to toggle a `.skeu-cursor-dot--active`/
  `--trail-active` state. This is new behavior, not present today.
- `src/styles/components/_organisms.scss` — add the hover/active state
  rules. Recommended approach: reuse the existing three-state link color
  axis (`--link-color`/`--link-hover`/`--link-active`) already established
  by `CLAUDE.md`'s design language, rather than introducing new `effects`
  tokens — keeps this out of the 13 drift checks (no new registry entries,
  no new per-theme values across all 9 `THEMES`). Confirmed safe against
  the drift checks: `--link-hover`/`--link-active` already drive hover/
  press color across Button's solid/outline/surface/chisel variants
  (`_atoms-button.scss`), so they already function as this codebase's
  general interactive-state axis, not a literal "link" concept — adding
  the cursor as another consumer doesn't trip `token-unused`/
  `token-example` (they only require at least one real consumer).
  **Decided (Ian 2026-07-09): use the clean three-state mapping.** Today
  both `.skeu-cursor-dot` and `.skeu-cursor-trail` render at rest using
  `--link-hover` (`_organisms.scss:216`, `:239`); this changes to rest=
  `--link-color`, hover=`--link-hover`, active=`--link-active` — the same
  three-state axis Button already uses. This does change the idle cursor's
  color as a side effect (confirmed and accepted), not just adds new
  states.
  Click state also needs a
  size change (item #4 leaves the exact combo open — "cursor smaller, trail
  same size" is the more legible tension cue and is the recommended
  default, but this is a visual call Ian should eyeball in the dev server
  before it's called final).
- `src/styles/components/_organisms.scss` (`.skeu-cursor-dot`,
  `.skeu-cursor-trail`) — items #9, #10: floor the rendered size. The
  cleanest mechanism is CSS `max()`/`min()` against the token, e.g.
  `width: max(var(--cursor-size), 4px)` for the dot, and for the trail
  `width: max(var(--cursor-trail), var(--cursor-size), 4px)` so the trail
  can never render smaller than the dot even if a theme or override sets it
  that way.
- `src/styles/token-registry.ts` — items #9, #10 (registry side): raise the
  `--cursor-size` range control's effective floor to 4 if the `range(...)`
  helper should reflect the new minimum in the admin slider itself (today
  it's `range('Custom cursor (0 = off)', 0, 40, 2)` — 0 is the explicit
  "off" state, so the floor likely belongs in CSS as above, not the control
  min, unless Ian wants "off" removed as an option — flag this distinction
  during implementation, not a blocking question).
- `src/styles/token-registry.ts` (`--texture-opacity` control) — items #7,
  #8: current max is `0.4`. Re-tune either the control's max ceiling
  downward, or (likely better per item #8's framing — "there must be a
  better texture grain effect than just making the page dark") change how
  `.skeu-texture-overlay` renders at high opacity in
  `src/styles/components/_organisms.scss` (e.g. blend mode other than
  plain opacity-over-background, so grain reads as texture rather than a
  darkening scrim).
- `src/components/organisms/TextureOverlay.tsx` / SCSS — item #7: the
  reactive blob (`--texture-reactivity`) is "too intense (large/dark)" —
  reduce the blob's max size/opacity ceiling and/or its
  `radial-gradient` mask falloff in `.skeu-texture-blob`.
- `src/pages/WelcomeView.tsx` or `src/components/organisms/CursorFX.tsx` —
  item #5 (bug, not tuning): the `DEFAULT_THEME` ("High Contrast") ships
  `cursorSize: '0px'`/`cursorTrail: '0px'` (`adminData.ts` line ~304), so a
  clean visitor sees NO custom cursor anywhere, including the splash — the
  effect is off by default site-wide, not selectively broken on `/`. Before
  changing code, reproduce live: load the site with a fresh localStorage,
  confirm the cursor is equally absent on `/about` and `/`. If Ian is
  actually seeing the effect elsewhere (a personal browser session with a
  theme/override that sets nonzero cursor values), the splash-specific gap
  needs isolating — check for a stacking-context or `.has-custom-cursor`
  specificity issue between `WelcomeView`'s `.name`/`.splash-enter` buttons
  and the global cursor overlay. This item's root cause is not yet
  confirmed; treat the above as an investigation starting point, not a
  prescribed fix.

## Approach and architectural reasoning

Hover/active cursor states are new interaction plumbing (global delegated
listeners), the first time `CursorFX` reacts to anything beyond raw pointer
position. Reusing existing link-color tokens for the color swap avoids
expanding the `effects` token surface and its drift-check burden; only a
size change (via a plain CSS class, not a token) is needed beyond that.

## Risks / tradeoffs

- Global `pointerover` delegation must correctly identify "interactive"
  targets without false-positiving on large containers — scope the
  selector list carefully (buttons, links, inputs, `[role="button"]",
sliders, accordion triggers) rather than matching everything with a
`cursor: pointer` computed style (expensive to check on every move).
- Reduced-motion and non-hover-capable devices already bail out of
  `CursorFX` entirely (existing `matchMedia` checks) — new listeners must
  respect the same early-return guards.
- Item #5's root cause is unconfirmed pending live repro; the fix scope
  could range from "one CSS specificity fix" to "default theme should ship
  nonzero cursor values" — the latter is a design decision (does Ian want
  the custom cursor on by default for every visitor?) that may need a
  quick confirmation once the repro is done, not before.

## Verification checklist

- `npm run check`, `npm test`, `npm run build`
- Manual: `npm run dev -- --port 3001` — verify hover state on buttons/
  links/sliders, click/active state on press (including during accordion
  and slider drags per item #4's examples), cursor never renders under 4px,
  trail never renders smaller than the dot, texture grain at max control
  value no longer reads as a dark scrim, and the splash page's cursor
  behavior matches (or is deliberately identical to) other routes.
