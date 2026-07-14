# Phase 6 — Cursor trail speed retuning

Status: ✅ DONE (2026-07-14) — `--anim-speed-slow` control retuned to
100-300ms (was 0-1500ms), all 9 `THEMES` rescaled proportionally
(Brutalist 100ms ... Pillow 300ms; High Contrast, `DEFAULT_THEME`, 150ms).
`_tokens.scss`'s `$anim-speed-slow` updated to 0.15s to match, preserving
the `default-value-sync` three-way agreement (registry default / SCSS
literal / `THEMES['High Contrast']`). `_base.scss` needed no edit — it
already derives from the SCSS variable via interpolation. Pre-existing
stale `0.5s` CSS fallback literals (unrelated files) left untouched, out of
scope. `npm run check`/`npm test` (128/128) green.

## Problem statement

The cursor trail's lag/ease speed is driven by `--anim-speed-slow`
(`_organisms.scss:420-422`) — not `--cursor-trail`, which is a pixel diameter,
not a duration. Across the 9 `THEMES` presets in `adminData.ts`, `animSlow`
currently ranges 0-1200ms (control range 0-1500ms,
`token-registry.ts:107`) — e.g. Pillow at 1200ms, Glow at 1000ms — consistent
with "much too slow." `--anim-speed-slow` is also consumed by several other
UI transitions (button transform/opacity, `PresetDial`'s position-settle
transition, view-transition pan animations) — it's a shared "slow" motion
tier, not cursor-trail-exclusive, so retuning it affects those consumers too
(very likely an improvement: 1+ second button feedback is arguably already
too slow across the board, not just for the cursor). Peer review confirmed
`FloatingNav` has no position transition at all (only `PresetDial` does) —
correcting an earlier assumption that both shared this transition.

Peer review also confirmed no pre-existing `default-value-sync` violation
today (registry, SCSS literal, and `THEMES['High Contrast']` all agree at
0.3s) — this phase must preserve that three-way agreement at whatever new
value High Contrast lands on. It also found three CSS rules with a stale
`var(--anim-speed-slow, 0.5s)` fallback that already doesn't match the
current 0.3s default (`_organisms.scss:104-105`, `_atoms-button.scss:381-382`,
`_admin-preview.scss:287`) — harmless today since the var is always set at
`:root`, but worth knowing this is pre-existing drift, not something to
silently "fix" as a drive-by while touching this token.

## Files to change and why

- `src/styles/token-registry.ts` — `--anim-speed-slow` control `min`/`max`.
- `src/styles/_tokens.scss` — `$anim-speed-slow` first-paint literal.
- `src/styles/_base.scss` — `:root` default (must match the above two).
- `src/pages/admin/adminData.ts` — `animSlow` value in all 9 `THEMES`
  entries.

## Approach and architectural reasoning

Tighten the control's range to 100-300ms per Ian's explicit spec ("min speed
100ms for speedy... max speed 300ms for really long"). Rescale each of the 9
presets' `animSlow` value into that new range, preserving their existing
relative order — the currently-snappiest preset lands near ~100ms, the
currently-most-languid lands near ~300ms, the rest interpolated between —
so each preset's relative "personality" survives, just compressed into a
faster, tighter band. This naturally produces some presets landing near the
middle of the new range (a "medium" feel) without inventing a 10th named
preset, matching Ian's "there needs to be a medium... or something like
that" as a byproduct of the rescale rather than new named preset.

High Contrast is `DEFAULT_THEME` — its new `animSlow` value must stay in
lockstep across the registry control default, the SCSS first-paint literal,
and `THEMES['High Contrast']`, per the existing enforced `default-value-sync`
drift check.

## Risks / tradeoffs

Low — token/data-only change, no new component wiring. The main risk is
forgetting one of the three places the default value must match (registry,
SCSS literal, THEMES entry), which `npm run check` will catch.

## Verification checklist

- `npm run check` (`default-value-sync`, `theme-control`, `token-example`
  especially), `npm test`
- Manual: cycle through presets in the design panel, confirm the cursor
  trail lag feels snappier at every preset, and confirm button/panel
  transitions elsewhere still feel reasonable (not broken by the tighter
  range).
