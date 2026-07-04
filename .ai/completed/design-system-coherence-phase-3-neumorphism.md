# Phase 3 — Neumorphism Conversion

Status: ✅ COMPLETE (2026-06-30). Part of `design-system-coherence-epic.md`.
Depends on Phase 1. Parallelizable with Phase 2.

## Problem statement (issues 4, 5, 6)

The system is skeuomorphic by construction. Shadow tokens
(`_tokens.scss:34-44,63-64`) are hardcoded black/green literals decoupled from
`--color-surface`, so they never blend (issue 5). The central elevation mixin
`skeuomorphic-surface` (`_tokens.scss:72-100`) always appends a downward black
drop shadow, so everything is raised at rest. ~6 components have no depth at all
(Input, ValueInput, Slider track, Badge, ColorPicker, FormField), and no
switch/toggle exists (issue 6). Links have no `z-index`/stacking strategy, and
`z-index` is not animatable, so paint order flips instantly while shadows
transition — the hover "sink/jump" (issue 4).

## Elevation contract — REVISED 2026-06-29 (Classic Windows 3D bevel)

The soft-neu first pass was rejected by Ian on visual review ("bubble" /
Frutiger-Aero look; shadows didn't blend; inset disliked). Reworked to the
**Classic Windows 95/98/NT bevel** language:

- **Hard-edged bevels, ZERO blur.** Depth is drawn with layered solid-color
  `inset` box-shadows (1–2px), not blurred halos. A hard sunken bevel is NOT
  the soft blurred inset Ian disliked — keep that distinction.
- **Backdrop-derived tones (the blend fix):** bevel tone vars
  (`--bevel-highlight`, `--bevel-light`, `--bevel-shadow`, `--bevel-dark-shadow`)
  derive from the color the element actually sits on — `--color-bg` for
  page-level controls, `--color-surface` for in-card controls — so edges blend
  into the real backdrop. Reuse the `neu-light`/`neu-dark` lightness helpers to
  produce the tones; JS twin recomputes tone vars on color edits.
- **Flat at rest → raised hard bevel on hover → sunken hard bevel on press**,
  for buttons AND links (no raised links until hover).
- **Buttons flat:** drop the gradient fill; flat face + hairline at rest,
  low-profile raised bevel on hover, sunken on press.
- **Fields (input/slider/switch):** NO soft resting inset. Flat with a hard 1px
  border at rest; focus = ring; slider track = thin flat groove; switch thumb =
  low-profile raised bevel. (Flag field treatment for Ian's review.)
- **Always-raised exceptions:** modals/dialogs, dropdowns/popovers keep a raised
  bevel border + minimal hard offset float. Nav/cards = flat panels.
- Keep it **low-profile** ("keyboard key"), less intense overall.

## Parametric depth — REVISED round 2 (2026-06-29)

Ian likes the bevel but wants the system to span **hard Win95 bevel ↔ soft
neumorphism**, tunable via sidebar sliders, with all feels available as presets.
Make the depth GEOMETRY token-driven so one mixin covers the whole range:

- New editable vars (controls in a "Depth" sidebar section, in the registry):
  `--depth-distance` (offset px), `--depth-blur` (px; **0 = hard bevel**, higher
  = soft neu), `--depth-intensity` (shadow alpha 0–1), `--depth-contrast`
  (multiplier on the tone lightness delta). The `bevel-raised`/`bevel-sunken`
  mixins consume these instead of hardcoded `1px 1px 0`.
- **Default feel:** bevel-leaning with slight softness (small distance + small
  blur), NOT 100% hard. Presets provide the full range.
- Every depth parameter gets a slider → satisfies Ian's "all toggles in the
  sidebar so I can tweak to taste."

## Component fixes — round 2 (2026-06-29)

- **Switch radius:** `.skeu-switch` does not consume `--radius-*`, so it ignores
  global shape presets (Chunky→Brutalist doesn't reshape it). Wire track + thumb
  to the radius tokens like other components.
- **Slider = filled track:** restyle `.skeu-slider` as a FILLED progress track
  (`■■■■■====]`) using the existing `--slider-pct` hook — a filled bevel segment
  up to the position + empty remainder, small thumb. The fill is the dominant
  visual, not a knob on a bare rail.

## Files to change and why

- `src/styles/_tokens.scss` — redefine the 10 shadow tokens
  (`$shadow-ambient/low/med/high`, `$inset-shadow-light/highlight`,
  `$pop-shadow-light/dark`, `$btn-elevation`, `$btn-surface-shadow`) as
  surface-derived via `color.scale`/`color.adjust`; rewrite
  `skeuomorphic-surface` (drop the always-on black drop; rest = flat-or-paired)
  and `skeuomorphic-inset` (re-tint). Rename mixins to `surface-elevation` /
  `surface-inset` to stop signalling skeuomorphism (update 9 call sites).
- `src/styles/_base.scss` — update the `:root` shadow var mirror (lines 42-50,
  69-70) so the SCSS defaults are themselves surface-derived (correct first
  paint before any JS runs).
- `src/hooks/useDesignVars.ts` — make the full neu shadow set reactive to the
  live `--color-surface`. **DECIDED (peer-review):** derived shadows are written
  **into the `vars` map** (exactly as `applyColorPreset` already stores
  `--pop-shadow-*` at `useDesignVars.ts:106-112`), NOT computed only in the
  `useLayoutEffect`. This preserves three things for free: localStorage
  persistence, replay by the `index.html` flash script (no FOUC on reload), and
  `exportText` completeness (`useDesignVars.ts:180-195` iterates `vars`). **Do
  NOT edit the `index.html` flash script** — it stays a dumb replay of `vars`.
  Note today's behavior is narrower than it looks: shadows recompute only inside
  `applyColorPreset`/`autoPopShadows`; a plain `setVar('--color-surface')` does
  NOT re-blend, and `recomputeDepthShadows` is angle-only (regex-extracts the
  existing rgba). So surface-reactive re-blend is **new** behavior to add: on any
  `--color-surface` change, recompute the whole shadow set into `vars`.
  **Precedence rule:** a surface edit overwrites derived shadow vars (manual
  shadow tweaks are transient); document this so it doesn't surprise. Tokenize
  and register the new shadow vars (coordinate with Phase 1 registry).
- `src/styles/_components.scss`:
  - Button family (`:31-126,452-468`) — hand-convert rest/hover/active to the
    contract; primary CTA = gentle persistent raise.
  - `.skeu-link` (`:306-321`, `@extend`s outline) — apply contract; **add a
    stacking strategy for issue 4**: `position:relative; isolation:isolate` and
    promote the hovered link with a stable `z-index` (e.g. base `z-index:0`,
    `:hover{z-index:2}`) plus a `:has`/`:focus-within` fallback; ensure the
    shadow design degrades gracefully so overlap no longer depends on DOM order.
    Keep shadow/transform transitioned; z-index flips once, hovered always wins.
  - Add depth to flat controls: `.skeu-input` (`:129-143`),
    `.skeu-value-input`, `.skeu-slider` track + tokenize the thumb's ad-hoc
    `0 2px 4px` (`:201,214`), `.skeu-badge` (`:575-585`), `.skeu-color-picker`
    (`:809-843`), `.skeu-form-field` (`:846-857`) — inset-at-rest for inputs
    (concave fields read natural in neu), subtle raise for badges.
- **NEW `src/components/atoms/Switch.tsx`** (+ SCSS `.skeu-switch`) — no toggle
  component exists; neu toggles are a signature control. Add atom + admin demo
  in `AtomsSection` (invariant).

## Approach / reasoning

Fix the 2 mixins + 10 tokens once → the 7 mixin-consumer components (card, nav
×3, accordion, expandable-card, modal) convert for free. Then hand-convert the
~6 button/link blocks and retrofit ~6 flat controls. Issue 4 is solved
structurally (stacking context) not by tuning. Shadows derived from live surface
also fixes issue 5 permanently across every theme/preset.

## Risks / tradeoffs

- Neu needs sufficient surface/background contrast; very low-contrast themes wash
  out. Document a minimum contrast and verify across existing color presets
  (Phase 4 will tune presets to honor it).
- Inset-at-rest inputs change the look significantly; get Ian's eyes early on one
  component before converting all.
- Shadow recomputation in JS must stay cheap (runs on color edits only).

## Verification checklist

- [ ] No black/green literal shadows remain; all derive from surface
- [ ] Rest = flat, hover = pop, press = inset across button/link/input/card/badge
- [ ] Hover between adjacent overlapping links is smooth, hovered always on top
- [ ] Input/Slider/Badge/ColorPicker/FormField have depth; Switch atom exists +
      demoed in AtomsSection
- [ ] Shadows re-blend live when `--color-surface` is edited in admin
- [ ] `npm run check`/`build`/`test` green; Ian visual sign-off per component
