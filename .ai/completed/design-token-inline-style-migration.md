# Epic: Design Token Inline Style Migration

## Goal

Eliminate all `style=` and `className` leaks from the codebase:

- Zero `style=` props except two dynamic CSS custom properties: `Slider --slider-pct`,
  `PushPanel --panel-width`
- Zero raw HTML elements using atomic CSS class strings directly
- Zero `className` passthroughs on atoms (replaced by explicit variant/size props)
- Zero bespoke SCSS files outside `src/styles/`
- Admin panel is Storybook-equivalent: atoms only, no raw class strings. Includes new
  Design Tokens view above Atoms section.

---

## Phases

- **Phase 1** — Token system update. See `design-token-migration-phase-1-tokens.md`
- **Phase 2** — Atom prop additions + className passthrough removal. See `design-token-migration-phase-2-atoms.md`
- **Phase 3** — Molecule and organism structural SCSS. See `design-token-migration-phase-3-components.md`
- **Phase 4** — Delete `preview.scss`, fix admin className leaks, add Design Tokens section. See `design-token-migration-phase-4-6-admin.md`
- **Phase 5** — Admin panel token controls (Typography, line-height, layout, motion). See `design-token-migration-phase-4-6-admin.md`
- **Phase 6** — Admin internal inline style cleanup (18 files). See `design-token-migration-phase-4-6-admin.md`

---

## Pre-existing bugs fixed in scope

- `CardWithDropdown` uses `Icon name="chevron"` — no such icon, silently renders `·`. Fix to `chevron-down`.
- `MoleculesSection.tsx` passes raw CSS class string as `className` to `<Card>` instead of `variant` prop.
- `WelcomeView` splash: `className={\`color-${hex}\`}`pattern — all 16`.color-\*`classes exist but pattern
is wrong. Replace with`--splash-color` CSS custom property.

---

## Risks

- **Font scale change is visually breaking.** Text grows ~1–2px. Ian must visual-review after Phase 1.
- **`max-height: 400px` ceiling.** Accordion/ExpandableCard clip at 400px — pre-existing, not in scope.
- **ExpandableCard/ContactModal drop `skeu-card`.** Must `@include skeuomorphic-surface` in new classes.
- **Ghost variant vs link-ghost.** `.skeu-btn--ghost` and `.skeu-link--ghost` — verify no duplication.
- **Removing `className` from atoms is a hard TypeScript break.** Fix all callers in same PR as prop removal.
- **`adminData.ts` type changes.** `ButtonVariant.cls` → `.variant`, `ButtonSize.cls` → `.size`, `CARD_COLOR_VARIANTS.variant` changes shape — update all consumers in same PR.

---

## Verification checklist (2026-06-25)

- [x] `npm run check` green
- [x] `npm run build` clean
- [x] `npm test` passes (no tests exist yet)
- [x] Product-code `style=` → only 3 legitimate CSS custom properties remain (Card `--card-max-width`, PushPanel `--panel-width`/`--panel-open-width`, WelcomeView `--splash-color`)
- [x] `find src -name "*.scss"` → only `src/styles/{_tokens,_base,_components,main}.scss`
- [x] Design Tokens section (TokensSection.tsx) — colors, typography, spacing, radii, motion swatches
- [ ] Home page visual review: masonry cards, sidebar, modals
- [ ] ExpandableCard, Accordion, PushPanel animations correct
- [ ] WelcomeView: 16 random splash colors cycle correctly
- [ ] Ian signs off on visual appearance after font scale change
