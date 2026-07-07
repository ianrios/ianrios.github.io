# Configurable font picker — future spec (Ian, 2026-07-07)

Not scheduled. Deferred out of the portfolio-v2 epic
(`.ai/plans/portfolio-v2-concepts.md`, section 10).

`--font-family-base` and `--font-family-display` already exist as registry
tokens (`src/styles/token-registry.ts`) with fixed literal defaults — that
part is done (Design P7). What's not built: a real picker letting a visitor
choose from a set of free Google Fonts in the admin token sidebar, the way
colors/spacing already have live controls.

Needs, when picked up:

- A curated font list (not an open text field — free Google Fonts only,
  loaded on demand)
- A loading strategy that doesn't block first paint (fonts loaded lazily
  like the rest of the admin surface)
- Wiring into the existing `design:v1` persistence shape so a font choice
  survives a return visit like other overrides do
