# Skeuomorphism Token Draft

This file contains the initial token draft created by GitHub Copilot.

## Tokens

- Colors
  - `$color-bg`: #efe9e1 (soft warm background)
  - `$color-surface`: #f7f3ef (card surface)
  - `$color-accent`: #c67c5a (warm accent)
  - `$color-muted`: #868086
  - `$color-text`: #2b2b2b

- Spacing scale
  - `$space-xxs` ... `$space-xl`

- Radii
  - `$radius-sm`, `$radius-md`, `$radius-lg`

- Shadows / Depth
  - `$shadow-ambient`, `$shadow-low`, `$shadow-med`, `$shadow-high`

- Mixins
  - `@mixin skeuomorphic-surface($elevation)` — applies gradient, radius, and elevation-specific box-shadow
  - `@mixin skeuomorphic-inset` — for pressed/embedded elements

## Decisions

- Primary (filled) buttons and unstyled inline links are deprecated for this project. Use the secondary outline style (`.skeu-btn--outline`) for all buttons and links so components read consistently as soft, raised mini-cards.

## Next steps

1. Add `src/styles/_tokens.scss` (done)
2. Wire tokens into an importable `src/styles/main.scss` and replace site `index.css` where needed
3. Add `sass` to project deps if not present
4. Build `/admin` route with UI to tweak tokens (localStorage + copy CSS)
