# Phase 1 — Random theme per visitor

Status: ✅ DONE (2026-07-09) — implemented exactly as planned (including
the `resetAll` preset-preserving behavior), all checks green.

Part of `.ai/plans/visitor-theming-epic.md`.

## Problem statement

Today every clean (never-customized) visitor gets `DEFAULT_THEME` ("High
Contrast") on every load — `useDesignVarsState`'s initial state is `{
theme: DEFAULT_THEME, overrides: {}, touched: false }`. **Decided (Ian
2026-07-09), simpler than theme-ideas.md's original framing**: an untouched
visitor gets a _fresh_ random theme (from the 9 in `THEMES`) on every single
visit — no persistence at all until they actually interact. The moment a
visitor picks a preset or edits a token, that becomes a real choice and
persists normally from then on. "Reset" reverts to the currently active
preset's clean defaults, not to the global `DEFAULT_THEME` constant.

## Files to change and why

- `src/hooks/DesignVarsProvider.tsx` — `useDesignVarsState`'s initial
  `useState` initializer: when `loadStoredDesign(THEMES)` returns `null`
  (never customized), instead of `{ theme: DEFAULT_THEME, overrides: {},
touched: false }`, pick a random entry from `THEMES` and return `{
theme: <picked>.name, overrides: {}, touched: false }` — **`touched`
  stays `false`**. This is the one substantive difference from a naive
  reading of theme-ideas.md: nothing is written to `localStorage` for a
  purely random assignment, so an untouched visitor re-rolls a new random
  theme on every visit, forever — not just the first. The existing
  persist-on-`touched` effect (lines ~61-66) is otherwise unchanged; a
  visitor who then picks a theme or edits a token via `applyTheme`/`setVar`
  already sets `touched: true` today, so that path needs no changes at all
  — it already persists the chosen state on subsequent visits exactly as
  asked.
- `src/hooks/DesignVarsProvider.tsx` — `resetAll` (lines ~87-90): currently
  `clearStoredDesign(); setState({ theme: DEFAULT_THEME, overrides: {},
touched: false })` — always jumps to the global default theme. Change to
  clear only the `overrides`, keep `state.theme` as whatever preset is
  currently active, and persist that clean state (`touched: true`) so it
  survives a reload rather than falling back into the "untouched, re-roll
  every visit" bucket. Only fall back to `DEFAULT_THEME` if `state.theme`
  is `null` (raw overrides with no preset ever chosen — there's no "preset
  defaults" to return to in that case). This is the concrete reading of
  "reset back to the preset defaults, not a global all-users default."
- `src/hooks/DesignVarsProvider.test.tsx` — the test `'fresh visit: default
theme active, nothing persisted'` (lines ~54-61) currently asserts
  `activeTheme === DEFAULT_THEME` AND `stored() === null`. Under this
  design, `stored() === null` **still holds** (nothing persists for a pure
  random pick — this part of the contract is unchanged), but
  `activeTheme === DEFAULT_THEME` no longer holds (it's now one of
  `THEMES`, chosen randomly). Loosen that one assertion to `THEMES.some(t
=> t.name === activeTheme)`; leave the `stored() === null` assertion as
  is, since it's still true and still worth guarding. Add a test for the
  new `resetAll` behavior: after picking a theme and editing a token,
  `resetAll()` returns to that theme's clean vars (not `DEFAULT_THEME`,
  unless that happened to be the active theme).
- `CLAUDE.md` — the sentence _"clean visits persist nothing, so default
  changes reach returning visitors"_ **remains true** under this design
  (a purely untouched visitor still persists nothing) and needs no edit.

## Approach and architectural reasoning

Both changes are narrow edits to `useDesignVarsState`'s two state-producing
paths (initial mount, `resetAll`) — no new state shape, no new persistence
mechanism. `loadStoredDesign`/`persistDesign` (`designStorage.ts`) already
handle arbitrary `theme` names from `THEMES` and a `theme: null` case, since
that's exactly what manual theme selection and raw token overrides already
produce. This design is simpler than the original theme-ideas.md framing
("persist a random pick") specifically because it makes zero exceptions to
the existing `touched`-gates-persistence rule — a random pick is not a
choice, so it doesn't count as `touched`, full stop.

## Risks / tradeoffs

- **First-paint flash on every visit for untouched visitors, not just the
  first**: the `index.html` flash script replays whatever `snapshot` was
  last persisted. An untouched visitor never persists anything, so every
  single load paints the SCSS-literal High Contrast first (confirmed:
  `body { background: var(--color-bg); }` in `_base.scss:119` paints
  synchronously from the static stylesheet before the deferred module
  script runs), then pops to that visit's random pick once JS mounts. This
  is a direct, accepted consequence of "revisiting with no changes means a
  new theme" — flagging it as a real, permanent (not one-time) visual
  discontinuity worth seeing live, not asking it to be reconsidered.
- Random selection must use the same `THEMES` array `DesignVarsProvider`
  already imports — no separate list to keep in sync.
- `Math.random()` selection needs no seeding/determinism; intentionally
  simpler than `WelcomeView`'s `pickColor()` (which avoids repeating the
  last 3 picks) — theme-ideas.md doesn't ask for repeat avoidance and
  Ian's clarified design ("simple as that") doesn't either, so plain random
  is the right scope here.
- The `resetAll` fallback-to-`DEFAULT_THEME`-when-`theme-is-null` clause is
  this plan's own reasonable extension of Ian's stated rule (he didn't
  specify the no-active-preset case) — worth a quick glance during
  implementation review, not a blocker.

## Verification checklist

- `npm run check`, `npm test`, `npm run build`
- Manual: clear `localStorage`, hard-reload several times in a private
  window with no interaction — confirm a different theme lands each time
  and `localStorage['design:v1']` stays empty throughout. Then pick a theme
  from the panel and edit one token; reload and confirm that exact
  theme+edit persists (no re-randomization). Then click Reset; confirm it
  returns to that theme's clean defaults (not High Contrast, unless that
  was the active theme); reload again and confirm the clean theme still
  persists (not a new random pick).
