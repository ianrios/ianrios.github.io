# Epic: Mobile polish + panel consolidation

Source: Ian's live-testing feedback pass, 2026-07-14 (10 items across mobile
nav, panel/content layout, panel content, and cursor behavior).

## Phase 1 — Mobile nav drawer persistence bug ✅ DONE — see `.ai/completed/mobile-polish-phase-1-nav-drawer.md`

## Phase 2 — Touch interaction fixes (slider drag + cursor hide) ✅ DONE — see `.ai/completed/mobile-polish-phase-2-touch-interaction.md`

## Phase 3 — Title-click panel-close gating + PresetDial mobile-hide verification ✅ DONE — see `.ai/completed/mobile-polish-phase-3-title-click-dial.md`

## Phase 4 — Content layout architecture (centering, scaling, padding) ✅ DONE — see `.ai/completed/mobile-polish-phase-4-content-layout.md`

## Phase 5 — FunPanel removal; single full design panel; type-scale relocation ✅ DONE — see `.ai/completed/mobile-polish-phase-5-panel-consolidation.md`

## Phase 6 — Cursor trail speed retuning ✅ DONE — see `.ai/completed/mobile-polish-phase-6-cursor-speed.md`

## Epic status

Approved by Ian 2026-07-14. All 6 phases shipped 2026-07-14. `npm run check`,
`npm test` (128/128), and `npm run build` all green after every phase and
once more after the full merge. `CLAUDE.md` updated (FunPanel references
replaced). Deployed to ianrios.me same day.

Two live-testing passes followed, both same day, both deployed:

**Pass 1** — content still wasn't centered/symmetric despite Phase 4's fix,
and title-click still needed two clicks despite Phase 3. Root causes: no
`min-width: 0` on the content column (flex default blocked shrinking when
the panel opened), a default Stack `gap` on `PanelLayout.tsx`'s outer row
(asymmetric buffer, invisible on the content's right side since nothing
follows it there), the reveal tab reserving real layout width before it
was ever visible, and the title-click gate stopping at "close the panel"
instead of also completing the navigation on the same click. Two of these
needed a one-time, Ian-approved Playwright inspection after repeated
static-analysis misses (three wrong diagnoses in a row) — scratchpad-only,
never added to this project as a dependency.

**Pass 2** — Ian's own mobile-device testing (not just dev-server viewport
emulation) found: a cursor `:active` CSS-specificity bug (grab cursor
beating the global `cursor: none` override — fixed with a scoped
`!important`, the correct tool for a global mode override); the design
panel showing every section open by default instead of just Themes; the
About page's floating links bar colliding with the mobile hamburger and
in fact overflowing the device edge entirely (5 links' worth of `nowrap`
labels never fit one row on a narrow phone at all, at any panel state —
fixed by rendering the links inline in normal scroll flow on mobile
instead of floating them, per Ian's own suggested direction, replacing a
more complex floating-bar fix that didn't hold up); a dead
`flex-wrap: wrap` CSS rule never actually applied to the Home page's
tabs (large-scale theme presets like Maximal clipped the "projects" tab
off mobile screens entirely); and oversized presets (Maximal, Brutalist)
wrapping body text to 1-3 words per line on mobile (fixed with a
font-size ceiling clamped at the Heading/Text atoms specifically — an
earlier attempt to clamp the `--font-*` custom properties directly failed
silently, confirmed empirically to be a circular self-reference through
DesignVarsProvider's inline-styled tokens).

Ian confirmed real-device mobile testing looks good after Pass 2. Still
open, not yet scoped: Ian's broader invitation to "rethink how to retool
the themes on smaller devices" (a real component-composition proposal, not
another reactive patch) — see `.ai/WORK.md` open questions.
