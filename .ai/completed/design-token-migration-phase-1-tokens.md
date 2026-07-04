# Phase 1 — Token System Update

Part of epic: `design-token-inline-style-migration.md`

---

## `src/styles/_tokens.scss`

Change font scale from odd-pixel to standard even-pixel:

| Token        | Old  | New  |
| ------------ | ---- | ---- |
| `$font-xxs`  | 8px  | 10px |
| `$font-xs`   | 11px | 12px |
| `$font-sm`   | 13px | 14px |
| `$font-base` | 15px | 16px |
| `$font-lg`   | 17px | 18px |

Add missing tokens:

```scss
$line-height-base: 1.5;
$line-height-loose: 1.6;
$anim-speed-slow: 0.5s;
```

## `src/styles/_base.scss`

Expose new tokens in `:root`:

```scss
--line-height-base: #{$line-height-base};
--line-height-loose: #{$line-height-loose};
--anim-speed-slow: #{$anim-speed-slow};
```

Existing `--font-*` custom properties update automatically via SCSS variables.

Remove all 16 `.color-*` splash classes (`.color-74A57F` etc.) — replaced by
`--splash-color` CSS custom property in Phase 3.

## Impact

All text rendered via token vars grows ~1–2px. Hardcoded sizes in components
are corrected to nearest token in Phase 3 — not preserved.

Ian must visual-review the site after this phase before proceeding to Phase 2.
