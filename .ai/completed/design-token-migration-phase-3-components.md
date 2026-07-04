# Phase 3 — Molecule and Organism Structural SCSS

Part of epic: `design-token-inline-style-migration.md`

All new classes go into `_components.scss`. No new SCSS files created. State-driven
styles (open/closed, hidden/shown) use `.is-open` / `.is-hidden` class toggles + CSS.
Hardcoded pixel sizes corrected to nearest token.

---

## Molecules

**`FormField.tsx`** — add `.skeu-form-field__label` (block, font-sm, bold, color-text, margin-xxs below),
`.skeu-form-field__hint` (font-xs, color-muted, margin-xxs above). Use `<Input fullWidth>`.

**`NavBar.tsx`** — `.skeu-nav` exists. Add `.skeu-nav__title` (bold, color-text),
`.skeu-nav__links` (flex, gap-xs, align-center). Move `textTransform: capitalize` into
`.skeu-nav .skeu-btn, .skeu-nav .skeu-link`.

**`NavVertical.tsx`** — replace `className="skeu-card"` with `.skeu-nav-vertical`
(`@include skeuomorphic-surface('low')`, width 160px, padding-sm, radius-md).
Add `.skeu-nav-vertical__title` (bold, font-sm, color-text, padding-xxs/xs, margin-xs below),
`.skeu-nav-vertical__links` (flex col, gap-xxs), `.skeu-nav-vertical__cta` (border-top, margin/padding-xxs).
Nav buttons → `<Button fullWidth>`. Remove all inline styles.

**`NavVerticalSections.tsx`** — replace `className="skeu-card"` with `.skeu-nav-sections`.
Build full BEM tree. `display: open ? 'flex' : 'none'` → `.is-open` class + `display: none / flex`.

**`CardWithDropdown.tsx`** — fix `Icon name="chevron"` → `name="chevron-down"`. Remove `iconStyle`
rotation — use `.skeu-card-dropdown.is-open .skeu-icon { transform: rotate(90deg); }`.
`<Card style={{ maxWidth: 280 }}>` → `<Card maxWidth={280}>`.
`<Card style={{ padding: 'var(--space-xxs)' }}>` → `<Card padding="xs">`.
Buttons → `<Button fullWidth>` / `<Button fullWidth justify="between">`.
Add `.skeu-card-dropdown` (position relative, margin-sm below),
`.skeu-card-dropdown__list` (absolute, top calc(100% + space-xxs), left 0, right 0, z-index 20,
overflow hidden, max-height 0, transition), `.skeu-card-dropdown.is-open .skeu-card-dropdown__list`
(max-height 200px).

**`Accordion.tsx`** — replace JS object toggle with `variant?: 'inline' | 'default'` prop →
`.skeu-accordion--inline`. All inline styles → BEM:
`.skeu-accordion` (surface mixin, radius-md, overflow hidden),
`.skeu-accordion--inline` (bg-accent, radius-sm, no shadow),
`.skeu-accordion__item` (border-top border-color), `:first-child` (no border),
`.skeu-accordion__body` (overflow hidden, max-height 0, opacity 0, transition),
`.skeu-accordion__body.is-open` (max-height 400px, opacity 1),
`.skeu-accordion__content` (padding sm/md, font-sm, color-text, opacity 0.8, line-height-loose),
`.skeu-accordion__caret` (font-xs, opacity 0.55, transition transform),
`.is-open .skeu-accordion__caret` (rotate 90deg).

---

## Organisms

**`ExpandableCard.tsx`** — drop `className="skeu-card"`. New `.skeu-expandable-card` absorbs
`@include skeuomorphic-surface('low')` + padding-md + radius-md + cursor pointer + user-select none

- margin-sm below. Open/close via `.is-open` on root.
  Child classes: `__header` (flex, space-between, align-start), `__title` (bold, font-base, color-text),
  `__meta` (font-xs, color-muted), `__caret` (font-base, color-muted, flex-shrink 0, transition rotate),
  `.is-open __caret` (rotate 180deg), `__body` (overflow hidden, max-height 0, opacity 0, transition),
  `.is-open __body` (max-height 400px, opacity 1), `__divider` (margin-top sm, border-top, padding-top sm),
  `__tags` (flex, gap-xxs, flex-wrap, margin-xs below), `__bullet` (font-xs, color-text, opacity 0.8,
  padding-left sm, margin-xxs below, border-left 2px color-accent).

**`masonry-card.tsx`** — replace raw `<div className={['skeu-card', variantClass]...}>` with
`<Card variant={variantClass || undefined}>`. Add:
`.skeu-masonry-card__meta` (font-sm, color-muted, margin-xxs/0),
`.skeu-masonry-card__img` (block, width 100%, radius-sm, margin-xs below),
`.skeu-masonry-card__divider` (border-color, 1px solid top, margin-xs/0),
`.skeu-masonry-card__tool-toggle` (reset button, flex, align-center, gap-xxs, color-text, bold, font-sm, font-family inherit, padding 0),
`.skeu-masonry-card__tools` (flex, gap-xxs, flex-wrap, margin-xxs above),
`.skeu-masonry-card__links` (flex, gap-xs, margin-sm above, flex-wrap, align-center).

**`ContactModal.tsx`** — replace raw `<button className="skeu-btn skeu-btn--outline">` with
`<Button variant="outline">`. Replace `<div className="skeu-card">` with `.skeu-modal` structure:
`.skeu-modal-backdrop` (fixed, inset 0, z-index 1000, flex, align-center, justify-center),
`.skeu-modal-overlay` (absolute, inset 0, bg overlay-bg),
`.skeu-modal` (relative, z-index 1, width min(modal-max-width, 92vw), max-height 90vh, overflow auto,
flex col, gap-sm, `@include skeuomorphic-surface('high')`, padding-md, radius-md),
`.skeu-modal__footer` (text-align right), `.skeu-modal__iframe` (border none, display block, flex-shrink 0).

**`PageLayout.tsx`** — remove `style` passthrough. Add `.skeu-page-layout`
(bg-bg, color-text, padding-lg, radius-lg).

**`PortfolioSidebar.tsx`** — replace 4x `<button className="skeu-btn skeu-btn--outline" style={navBtnStyle}>`
with `<Button variant="outline" fullWidth>`. Add `.skeu-sidebar__heading` (margin-sm below),
`.skeu-sidebar-skills` (flex, gap-xxs, flex-wrap, margin-xs below),
`.skeu-sidebar-links` (display none, flex-col when `.is-open`, gap-xxs, font-sm, margin-xs below, list-style none, padding 0),
`.skeu-sidebar-links.is-open` (display flex). `ul` state toggle via `.is-open` class.

**`PushPanel.tsx`** — remove `panelStyle` prop. `Home.tsx` passes `panelStyle={{ padding: 0, overflowY: 'auto' }}`
— both are already default in the new CSS class, drop from call site.
Three CSS classes: `.skeu-push-panel` (flex, flex-shrink 0, height 100%, align-self stretch),
`.skeu-push-panel__clip` (transition width anim-speed, overflow hidden, flex-shrink 0, height 100%),
`.skeu-push-panel__inner` (width var(--panel-width, 400px), height 100%, overflow-y auto, border-right border-color).
Dynamic: `style={{ '--panel-width': \`${open ? width : 0}px\` }}`on`.skeu-push-panel\_\_clip`— the only inline in this component.
Tab reveal:`tabShown`state → toggle`.is-hidden`on tab button.`.skeu-push-tab.is-hidden`(transform translateX(-100%), opacity 0, pointer-events none,
transition uses`--anim-speed-slow`).
Move `transition: 0.5s`literal from JSX into`.skeu-push-tab` SCSS.

---

## Pages

**`ThreeScene.tsx`** — `.skeu-scene-container { position: fixed; inset: 0; }`. Audit HUD overlay.

**`WelcomeView.tsx`** — three changes:

1. Splash colors: remove `className={\`color-${color}\`}`. Add `style={{ '--splash-color': \`#${color}\` }}`on container. SCSS:`.view-1 .name { color: var(--splash-color, var(--color-text)); }`
2. `open-link` → `<Button variant="ghost">`. Delete `.open-link` from `_components.scss`.
   `.view-1 .skeu-btn--ghost { font-family: 'Montserrat', sans-serif; margin-top: var(--space-lg); }`
3. `span role="button"` for name → `<button>` element. Apply `.name .skeu-btn--ghost` or reset
   via CSS so `.name` sizing rules win over button defaults.

**`Home.tsx`** — inline layout → page classes in `_base.scss`:
`.home-layout` (flex, min-height 100vh), `.home-sidebar` (sidebar-width, flex-shrink 0, padding-md,
overflow-y auto, max-height 100vh, sticky top 0), `.home-content` (flex 1, overflow hidden, min-width 0).
`DESIGN_SIDEBAR_STYLE` constant → `.home-design-sidebar` class.
Mobile hamburger → `.skeu-hamburger` (position fixed, top/left space-xs, z-index 50, bg none,
border none, cursor pointer, color-text, padding-xxs, line-height 1).

**`MobileNavDrawer.tsx`** — `.skeu-mobile-drawer` (fixed, inset 0, z-index 200),
`.skeu-mobile-drawer__overlay` (absolute, inset 0, bg overlay-bg),
`.skeu-mobile-drawer__panel` (absolute, top 0, left 0, width drawer-width, height 100%,
overflow-y auto, bg surface, padding-md), `.skeu-mobile-drawer__heading` (margin 0).
