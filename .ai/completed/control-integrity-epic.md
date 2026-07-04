# Epic — Control ↔ Effect ↔ Example Integrity

Status: **✅ COMPLETE (2026-07-03).** All 5 phases shipped; nine drift checks gate
`npm run check`; unified `Button`; grouped preview nav.

## Why

After the Design System Coherence epic shipped, Ian audited the controls panel
and found controls that change tokens with **no visible effect**, controls that
are **mislabeled/miswired**, real tokens with **no live example**, and several
demo **visual bugs**. Two read-only audits (2026-06-30) confirmed root causes.

The prior epic codified "every token has a control" (`[theme-control]`) but
nothing guaranteed every token has a real **effect** or a visible **example**.
This epic closes that loop and cleans up the bevel-rework relics.

## Audit findings (verified, file:line)

**Dead tokens — 0 `var()` consumers (controls do nothing):**
`--btn-gradient-end`, `--btn-overlay-opacity`, `--btn-top-highlight`,
`--btn-elevation` (+ the entire Elevation low/med/high picker), `--btn-radius-lg`.
(Relics of the pre-bevel button. NOTE: the previous epic's parity fix even added
controls to 3 of these — wrong direction; they should be removed.)

**Miswired / mislabeled:**

- `--btn-text-color` ("Fill text") sets color on the **base button only**
  (`_components.scss:43`); Primary & Outline use `--color-text` → control implies
  global but isn't.
- `--btn-gradient-start` is alive but is the **text color of primary _links_**
  (`_components.scss:402`, background-clip text), mislabeled and sitting in the
  Button section.

**Real but no/weak example:** `--drawer-width` (mobile drawer only, `:1787`),
`--modal-max-width` (`:1193`), `--overlay-bg` (modal/drawer scrim, `:1187/1780`),
`--anim-speed-slow` (push-tab hide, `:1279`), `--space-xl` (only pads the admin
body, `:1337` — effectively product-dead), `--font-xxs` (mixed-grid desc, `:1727`),
`--line-height-loose` (accordion content, `:1044`).

**Button variants collapsed:** Gradient/Primary/Outline all render transparent &
flat; "Outline" has no border; "Gradient" is a relic name. Demo descriptions are
stale ("gradient — btn-fill-text").

**Visual bugs:** button-state demo paints a square bevel on a wrapper `div` not
the rounded button (`ButtonHelpers.tsx:24`); IconButton row mixes SVG + Unicode
glyphs so each content-sized square comes out a different size, and the Plus
looks "stuck hover" because it's the only `variant=primary` (persistent raise).

## Approved decisions (2026-06-30)

- **Remove all 5 dead tokens + the Elevation picker.** Add a build-failing
  **`[token-unused]`** drift check: every editable token must have a real
  `var(--x)` CSS consumer.
- **Button variants → Primary + Outline (+ Ghost style for action cases).**
  Outline = transparent, mirrors the surface it sits on, with a real bevel
  **border** so it reads as an outline. Drop the redundant base "Gradient"
  variant. Ghost needs are met by surface **link** variants for navigation; keep
  a ghost _style_ on the Button atom only where an action must be a `<button>`
  (a11y). **Agent recommendation (confirm at approval):** Primary keeps its OWN
  text-color token (contrasts its fill); Outline/links share `--color-text`.
- **Every editable token must have a live example** in the preview. Add a
  **`[token-example]`** check (presence of the token name in the preview source
  — specimen or demo; honest limitation: presence, not proven visual change).
- **Preview reorg:** turn the existing Tokens/Atoms/Molecules/Organisms tiers
  into real **nav sections**; Combinations → a 5th **Patterns** section. V2 stays
  separate for now.
- Keep `--space-xl` but **wire it to a real product consumer** + example (don't
  leave it padding only admin chrome). Same showcase treatment for drawer/modal/
  overlay/anim-slow/font-xxs/line-height-loose.

## Phases — ✅ all done (2026-07-03)

- Phase 1 — Dead-Token Purge + `[token-unused]` Lint ✅ DONE — see `control-integrity-phase-1-dead-token-purge.md`
- Phase 2 — Button Variants (Primary/Outline; drop Gradient & ghost-button) ✅ DONE — see `control-integrity-phase-2-button-variants.md`
- Phase 3 — Unified Clickable Component (`<Button as>` replaces Link/IconButton/IconLink) ✅ DONE — see `control-integrity-phase-3-unified-clickable.md`
- Phase 4 — Live Example Per Token + Grouped Preview Nav ✅ DONE — see `control-integrity-phase-4-showcase-reorg.md`
- Phase 5 — Docs & Close-out ✅ DONE — see `control-integrity-phase-5-docs.md`

## Cross-cutting

Every phase keeps `npm run check` (now 7 → 9 drift checks), `npm run build`,
`npm test` green, plus Ian's visual review. Removing a token means updating ALL
surfaces (registry, THEMES, \_tokens/\_base, controls, components) in one go.

## Verification

Automated green is necessary, not sufficient — Ian signs off visually per phase.
End state: zero controls without an effect, zero tokens without an example.
