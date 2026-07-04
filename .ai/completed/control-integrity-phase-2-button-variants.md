# Phase 2 — Button Variants (Primary / Outline; drop Gradient & Ghost-button)

Status: ✅ COMPLETE (2026-07-03). Part of `control-integrity-epic.md`.
Depends on Phase 1.

## Problem (verified)

`gradient` (base `.skeu-btn`), `primary`, `outline` render nearly identically:
all `background: transparent` + flat; `.skeu-btn--outline` has `border: none`
(`_components.scss:80-98`) so it isn't an outline; the only at-rest differences
are text color/weight. "Gradient" is a relic name. Ghost button overlaps the
surface-link `--text`/`--ghost` variants.

## Target design (approved; one item pending Ian confirm)

- **Primary** = the emphasis button: a real **fill** (own `--btn-primary-bg`) +
  persistent raised bevel. **Text color (decided 2026-06-30, hybrid per Ian):**
  Primary uses an independent token `--btn-primary-text` (repurpose
  `--btn-text-color`) so contrast is always controllable, but each theme DEFAULTS
  it to that theme's `--color-text` (cohesive with Outline) wherever legible on
  the fill, and only OVERRIDES to a contrasting value on the trap themes
  (Glow, Maximal, Brutalist, High Contrast). Agent picks the 9 `--btn-primary-bg`
  fills + the 9 `--btn-primary-text` values and contrast-checks each pair.
- **Outline** = transparent (mirrors the surface it sits on) + a real **bevel
  border** so it reads as an outline; text = `--color-text`; raised on hover,
  sunken on press.
- **Drop the base "Gradient" variant.** Default variant is **already `outline`**
  (`Button.tsx:19`) — no default flip. The real re-skin: ~15 `<Button>` sites with
  no explicit variant (NavBar, NavVertical×2, CardWithDropdown×2, PortfolioSidebar×4,
  Admin, etc.) will newly gain a real **border** from the outline restyle. That's
  the cross-theme visual change to review — caused by the border, not a default
  change.
- **Ghost button:** peer-review confirms `variant="ghost"` and `gradient` have
  **0 call sites** in `src/` (only `outline`×16, `primary`×10). So removal is
  purely deleting them from the `Button.tsx` variant union, the `BUTTON_VARIANTS`
  demo data (`adminData.ts:549-561`), and the `ButtonHelpers.tsx:10` union — no
  migration, and the a11y "action must be a `<button>`" contingency has no
  trigger. Ghost navigation needs are met by surface link variants.

## Changes

- `src/components/atoms/Button.tsx` — variant union → `'primary' | 'outline'`
  (+ optional `'ghost'` only if needed); default `'outline'`; map to classes.
- `src/styles/_components.scss` — `.skeu-btn--primary` gets fill + own text +
  resting raise; `.skeu-btn--outline` gets a real surface-mirroring bevel border;
  remove base-`.skeu-btn` "gradient" styling assumptions; remove/repoint ghost.
- `src/styles/token-registry.ts` / `_tokens.scss` / `_base.scss` / `adminData.ts`
  — add `--btn-primary-bg` (control + consumer + example). This needs a `ThemeSpec`
  field + **a hand-picked fill for each of the 9 themes** + (if Primary text is
  independent — see below) a `--btn-primary-text` per theme. Agent will choose
  tasteful per-theme defaults and **contrast-check each** (High Contrast, Brutalist,
  Glow, Maximal are the traps); Ian tweaks live.
- Dropping `'gradient'`/`'ghost'` from the variant union breaks the
  `ButtonHelpers.tsx:10` / `button-helpers-data.ts` types — **Phase 2 must update
  those unions so the tree compiles**, even though Phase 3 owns the demo visuals.
- No call-site migration needed (ghost/gradient unused). Update demos:
  `ButtonAtoms.tsx`, `adminData.ts:549-561` (stale variant list + "gradient" copy).

## Risks / tradeoffs

- Changing the default variant re-skins every button site — audit + migrate
  thoroughly; visual review across themes.
- New `--btn-primary-bg` must have a real consumer + control + example (satisfies
  `[token-unused]` and the Phase 4 `[token-example]`).
- Primary text-vs-fill contrast across all 9 themes — verify (esp. High Contrast,
  Brutalist, Paper, Glow).

## Verification

- [ ] Outline visibly outlined & mirrors its surface; Primary filled + emphasis
- [ ] No `gradient`/base button variant remains; default is outline; ghost only
      where justified
- [ ] All button call sites migrated; admin demos updated & accurate
- [ ] `npm run check`/`build`/`test` green; Ian visual sign-off across themes
