# Phase 2 — Atom Prop Additions + className Passthrough Removal

Part of epic: `design-token-inline-style-migration.md`

Rule: every atom removes `style` and `className` passthroughs. Callers use props only.

---

## `src/components/atoms/Button.tsx`

New props:

- `fullWidth?: boolean` → `.skeu-btn--full`: `display: flex; width: 100%; align-items: center; gap: var(--space-xxs);`
- `justify?: 'start' | 'center' | 'between'` — only with `fullWidth`. Adds `justify-content` rule.
- `variant` gains `'ghost'` → `.skeu-btn--ghost` (replaces `.open-link` class):
  `all: unset; color: var(--link-color); cursor: pointer; transition: color var(--anim-speed) ease;` + hover/active link colors.
  Check `.skeu-link--ghost` before writing — extend or deduplicate.

Remove `className` passthrough.

## `src/components/atoms/Badge.tsx`

Add `size?: 'xs'` → `.skeu-badge--xs` (smaller font/padding).
Remove `style` and `className` passthroughs.
Callers using `style={{ fontSize: 9, padding: '1px 6px' }}` → `size="xs"`.

## `src/components/atoms/Input.tsx`

Add `fullWidth?: boolean` → `.skeu-input--full`: `display: block; width: 100%;`
Remove `style` and `className` passthroughs.

## `src/components/atoms/Icon.tsx`

Move inline layout to `.skeu-icon`: `display: inline-block; flex-shrink: 0; vertical-align: middle;`
Apply to both SVG and span branches. `size` prop stays as JSX attribute (dynamic).
Remove `iconStyle` prop. Remove `className` passthrough.

## `src/components/atoms/IconButton.tsx`

Move inline flex to `.skeu-btn--icon`: `display: inline-flex; align-items: center; justify-content: center; padding: var(--btn-padding-y); aspect-ratio: 1 / 1;`
Remove `style` and `className` passthroughs.

## `src/components/atoms/IconLink.tsx`

Same as IconButton. Flex layout → `.skeu-icon-link` class.
Remove `style` and `className` passthroughs.

## `src/components/atoms/ColorPicker.tsx`, `ValueInput.tsx`, `Slider.tsx`

Remove `style` and `className` passthroughs from all three.
`Slider`: keep `--slider-pct` dynamic inline. Remove outer `style` passthrough (line 38).

## `src/components/atoms/Link.tsx`

Remove `className` passthrough only. Props `variant/color/size/underline` already cover all cases.

## `src/components/molecules/Card.tsx`

New props:

- `padding?: 'none' | 'xs' | 'sm' | 'md'` (default `'md'`) → `.skeu-card--padding-{none,xs,sm}`
- `variant?: 'accent' | 'muted'` → wires existing `.skeu-card--accent`, `.skeu-card--muted`
- `maxWidth?: number` → sets `--card-max-width` CSS custom property inline; add `max-width: var(--card-max-width, none)` to `.skeu-card`

Remove `style` and `className` passthroughs.

## `src/pages/admin/adminData.ts`

`BUTTON_VARIANTS`: change `cls: 'skeu-btn--primary'` → `variant: 'primary'` (and `gradient`, `outline`).
`BUTTON_SIZES`: change `cls: 'skeu-btn--xs'` → `size: 'xs'` (etc.).
`CARD_COLOR_VARIANTS`: change `variant: 'skeu-card--accent'` → `variant: 'accent'`.
Update TypeScript types `ButtonVariant`, `ButtonSize`, `CardColorVariant` accordingly.
`ButtonAtoms.tsx` and `ButtonHelpers.tsx` update to render `<Button variant={v.variant} size={v.size}>`.

---

## Files changed this phase

`Button.tsx`, `Badge.tsx`, `Input.tsx`, `Icon.tsx`, `IconButton.tsx`, `IconLink.tsx`,
`ColorPicker.tsx`, `ValueInput.tsx`, `Slider.tsx`, `Link.tsx`, `Card.tsx`,
`adminData.ts`, `ButtonAtoms.tsx`, `ButtonHelpers.tsx`, `_components.scss`
