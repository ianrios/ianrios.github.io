# Phase 3 — Unified Clickable Component

Status: ✅ COMPLETE (2026-07-03). Part of `control-integrity-epic.md`.
Replaces the old "visual-bugs" phase (the button-state + IconButton size bugs are
solved by this unification). Peer-reviewed 2026-07-02; landmines folded in below.

## Problem

`Button`, `Link`, `IconButton`, `IconLink` are four components sharing ~80% of
their SCSS but with divergent prop APIs, 3 size models, 2 external-link
detections, and inconsistent states. Symptoms: surface links == outline buttons
(`.skeu-link @extend .skeu-btn--outline`, `_components.scss:279`); `solid`/primary
has no rest-vs-hover distinction (rest==hover, `:427-437`); icon buttons vs icon
links use different state models; icon squares size to glyph metrics.

## Decisions (Ian delegated design; engineering calls resolved from peer review)

- **One polymorphic `<Button as="button" | "link">`** (default `button`). Remove
  `Link`/`IconButton`/`IconLink`.
- **Orthogonal props:** `variant: 'solid'|'outline'|'surface'|'ghost'`,
  `color`, `size`, `icon`, `text`/children, `underline?: boolean`.
- **`color`/`textColor` = a SEMANTIC hand-maintained union**
  (`'default'|'muted'|'accent'|'primary'`, same as today's `Link.color`) that maps
  to **modifier classes** (NOT inline `style` — that's banned). Small, stable set;
  not codegen'd from the registry (registry holds `cssVar` strings, not semantic
  names). Low drift risk; documented.
- **Token-consumer preservation (fixes the `[token-unused]` landmines):**
  - `variant="solid"` KEEPS consuming `--btn-primary-bg` / `--btn-primary-text`
    (so "Primary" stays its per-theme emphasis color — NOT recolored to accent;
    tokens stay live). "Primary" = `variant="solid"`.
  - The `color` axis for outline/surface/ghost reuses the existing link color
    system, keeping `--link-color/-hover/-active` and `--link-primary-color` live.
- **State model** (uniform, per variant):
  - solid: filled, **flat at rest** → raise hover → sink active
  - outline: bevel border at rest → raise hover → sink active
  - surface: **smooth/no border at rest** → **real `border`** on hover (NOT an
    inset bevel — the `bevel-*` mixins are inset-only and can't express
    border-without-inner-shadow; use a real border or a new outline rule) →
    sunken "key" on active
  - ghost: bare text; color/underline shift only
- **Default `variant` = `outline`** (safe visible default; most button sites are
  outline). NOTE: `Link` defaults to `surface` today, so every migrated link needs
  an explicit `variant="surface"` — migration is NOT purely mechanical for links.
- **`as="link"` behavior:** internal (`href` starts with `/`) → RouterLink + `state`;
  else `<a>` (http(s) adds `target=_blank rel=noreferrer`; mailto/tel plain). This
  gives former IconLinks router support they lacked (intended improvement). ONE
  external rule, documented.
- **Icon-only:** `icon` + no text → square (`aspect-ratio:1/1`); `size` drives
  BOTH padding class and `Icon` px (`md` = 16px, the current default). `aria-label`
  is REQUIRED for icon-only (enforced by the type; all current sites pass it).
- **`disabled` on a link:** drop `href`/`to` (not focusable/activatable) +
  `aria-disabled` + `pointer-events:none`.

## Land in 3 green sub-steps (peer-review — don't ship 56 files at once)

- **3a — Build alongside:** new unified `Button.tsx` + new unified `.skeu-*`
  clickable class family (preserving `var()` consumers for ALL button/link tokens;
  add the real-border surface hover). Old atoms stay. Demo the unified `Button` in
  `AtomsSection`. Tree compiles; `[token-unused]`/`[demo-missing]`/`[token-specimen]`
  stay green; Ian gets a visual diff.
- **3b — Migrate ~53 call sites** to `<Button as=…>` (add `as="link"` + explicit
  `variant`/`color` for the 4 `Link` + 10 `IconLink`; `icon` for 6 `IconButton`;
  the raw `<a className="skeu-link">` grid at `AtomsSection.tsx:53`). Per-surface
  visual verify across themes. Watch the surface→outline default flip.
- **3c — Delete `Link`/`IconButton`/`IconLink` + their CSS**; re-point the
  contextual selectors the reviewer found: `.skeu-card--accent .skeu-btn--outline,
.skeu-card--accent .skeu-link` (`:260-266`), `.skeu-nav .skeu-btn, .skeu-nav
.skeu-link` (`:882-883`), the `@extend` couplings (`:472-473, :926, :952`), and
  `.skeu-icon-link` (`:509-536`). knip-clean.

## Risks / tradeoffs

- Discriminated union on `as`: `href/external/routerState/target/rel` link-only;
  `type/disabled` button-only; `aria-*`/`onClick`/`key` on both. Strict typing
  forces an explicit `as="link"` edit at every link site (good — catches misuse).
- Surface-default visual flip (§migration) is a VISUAL regression risk types won't
  catch — verify each migrated link.
- Removing atoms is a breaking internal API change; 3c does it in one pass, knip
  guards stragglers.

## Verification

- [ ] 3a: unified `Button` demoed; old atoms intact; all 8 drift checks + build +
      test green; Ian visual diff of the new variants/states
- [ ] solid rest≠hover; surface smooth-at-rest→real-border-on-hover→sink; outline
      unchanged; `--btn-primary-*` + `--link-*` still consumed (`[token-unused]`)
- [ ] 3b: all ~53 sites migrated; no surface→outline default regressions; router +
      external + disabled behavior verified
- [ ] 3c: `Link`/`IconButton`/`IconLink` gone; contextual selectors re-pointed;
      knip clean; icon buttons uniform size
- [ ] `npm run check`/`build`/`test` green; Ian visual sign-off across themes
