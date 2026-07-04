# Bugs and Technical Debt

## Bugs

_None currently tracked._ (Interactive-state bevels are wired structurally — the
unified `Button` derives hover/press bevels from the backdrop.)

## Technical debt

- No error boundaries
- No code splitting (could use `React.lazy` for routes)
- No 404 page (`App.tsx` has no catch-all route)

## Accessibility

- Missing `aria-labels` on some links (audit needed)
- Focus ring defined in `_base.scss` via `:focus-visible` + `@include focus-ring` — verify it shows across all interactive elements
