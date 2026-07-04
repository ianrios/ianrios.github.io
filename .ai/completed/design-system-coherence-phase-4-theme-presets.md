# Phase 4 — Complete Theme Presets

Status: ✅ COMPLETE (2026-06-30). Part of `design-system-coherence-epic.md`.
Depends on Phase 1 (registry) and Phase 3 (final shadow/token set).

## Problem statement (issues 2, 9)

Presets are category-scoped and partial: color presets (`adminData.ts:52-218`)
set only color/chrome; shape presets (`:220-359`) set only spacing/radii/button
geometry. None touch typography, motion, or layout. Several are near-duplicates
(Airy vs Bubble share `--space-sm/-md`; Flat vs Brutalist differ only in
elevation + `space-lg`; "Plastic" exists as both a color and a shape preset).
Presets feel weak because the live default (Chunky-sized spacing) sits at the
top of the range, so "Airy" is actually tighter than default. Ian wants every
token covered by a preset and presets that span the full range.

## Files to change and why

- `src/pages/admin/adminData.ts` — replace category presets with a set of
  **complete theme presets**. Each theme sets every category: colors + chrome +
  spacing + radii + button geometry + **typography (font scale + line-height)** +
  **motion (anim-speed + slow)** + **layout (sidebar/drawer/modal
  width)** + **depth geometry** (`--depth-distance` / `--depth-blur` /
  `--depth-intensity` / `--depth-contrast` — Phase 3 round 2). Presets carry the
  depth GEOMETRY params but **NOT the derived bevel TONE colors** (`--bevel-*`
  derive from `--color-bg`/`--color-surface` and are recomputed by `applyTheme`).
  **Span the depth range:** include a hard "Classic Bevel" (blur 0), a "Soft Neu"
  (high blur/distance), and middles. REVISED 2026-06-29: Ian wants a BROAD set —
  ~6 polished/tasteful identities (clean bevel, soft neu, brutalist, high-
  contrast, tight technical, soft rounded) PLUS ~3 funky/experimental ones
  (e.g. glow, pillow, maximal). Each spans tokens' full min→max so switching is
  dramatic. Remove near-duplicates and the color/shape name collision.
- `src/pages/admin/TokenPresets.tsx` / `TokenSidebar.tsx` — collapse the
  separate color-preset and shape-preset rows into one **theme** selector (each
  theme is one click that sets everything), or keep grouped rows but ensure each
  preset is full-identity. `detectMatchingPreset` compares the full token set.
- `src/hooks/useDesignVars.ts` — `applyColorPreset`/`applyShapePreset` become a
  single `applyTheme` that writes all categories and triggers shadow
  recomputation (Phase 3). Keep `resetAll` to registry defaults.
- Default starting theme — pick one whose spacing is mid-range (not the extreme)
  so other presets read as meaningfully tighter AND looser.

## Approach / reasoning

Complete themes make every token preset-covered (satisfies the Phase 1
`[preset-token]` direction and Ian's "all tokens in some preset"), and a
mid-range default fixes the "presets barely change" perception. Spanning the
full range per token makes preset switching feel substantial. Fewer, stronger,
distinct identities beats many near-duplicates.

## Risks / tradeoffs

- One-click full-theme switching is a bigger visual jump; ensure each theme is
  internally coherent (contrast valid for neu per Phase 3).
- Collapsing two preset rows into one changes admin IA; coordinate with Phase 5.
- Migrating away from the two independent `active` states needs care so the UI
  reflects the matched theme correctly.

## Verification checklist

- [ ] Each theme sets every token category (lint `[preset-token]` clean; no
      token absent from all presets)
- [ ] No near-duplicate themes; no color/shape name collision
- [ ] Default theme is mid-range; other themes read clearly tighter/looser
- [ ] Switching a theme visibly changes color, spacing, type, motion, and depth
- [ ] Each theme passes neu contrast minimum from Phase 3
- [ ] `npm run check`/`build`/`test` green; Ian visual sign-off
