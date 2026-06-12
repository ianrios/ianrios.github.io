# Bugs and Technical Debt

## Bugs

- **Link hover/active not wired to all interactive elements** — `--link-hover` and `--link-active` CSS custom props are defined and admin-editable, but accordions, nav buttons, and other interactive elements may not pick them up. Needs a targeted audit and CSS fix.

## Technical debt

- `App.css` still imported in `Home.js` — contains Bootstrap-era overrides and legacy rules. Should be consolidated into `_components.scss`/`_base.scss` and deleted.
- Bootstrap is still in `package.json` and likely still referenced somewhere. Find usages and remove.
- No error boundaries
- No code splitting (could use `React.lazy` for routes)
- No 404 page

## Accessibility

- Missing `aria-labels` on some links (audit needed after design system pass)
- Focus ring now defined in `_base.scss` via `:focus-visible` + `@include focus-ring` — verify it shows correctly across all interactive elements
