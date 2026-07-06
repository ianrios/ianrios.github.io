# Epic: Design System Integrity

Status: APPROVED 2026-07-06 (all open questions resolved — see Decisions in
`.ai/specs/platform-review-findings.md`). Findings referenced as F#.
Decisions baked in: stored shape `{version, theme, overrides, snapshot}` +
hand-rolled guards (P1); `DEFAULT_THEME = High Contrast` constant + value-sync
check (P2); drop `--link-primary-color`, primary axis uses `--btn-primary-bg`
(P3); warm detector removed (P4); font family tokenized, fixed, no control (P7).
Future theme ideas: `.ai/specs/theme-ideas.md`.

Problem: the token pipeline has correctness holes that reach real visitors —
stale localStorage keys are immortal (F1), registry and SCSS defaults can
silently disagree (F2), `color="primary"` is illegible in most themes (F3/F4),
the default-theme request (High Contrast, F13) is blocked by the persistence
model (F5), and the admin page runs two competing design-vars states (F8).

Each phase gets its own sub-plan in `.ai/plans/` + peer review + Ian's approval
before implementation. Phases 1→2 are ordered (2 depends on 1's persistence
model); 3–6 are independent after 1.

## Phase 1 — Stored-vars hygiene + persistence model

Resolves F1, F5. Gated on open question 1 (recommended: persist only
user-edited diffs).

- `loadStored()` filters to registry cssVars; derived `--bevel-*` never load or
  persist (always re-derived).
- Persist a diff over DEFAULTS (or versioned snapshot per Ian's call) so future
  default changes reach returning visitors; migrate/clear legacy
  `skeuomorph:vars` payloads once.
- Stored shape gets a strict typed schema + runtime guard (Ian's Zod ask, open
  question 13); same guard pattern applied to the `WelcomeView`/`location.state`
  parse sites.
- Keep the `index.html` flash script compatible with the stored shape.
- Unit tests: stale-key filtering, diff round-trip, legacy migration, guard.

Files: `adminData.ts`, `useDesignVars.ts`, `index.html`, `WelcomeView.tsx`,
`Home.tsx`, new tests.

## Phase 2 — Default theme + value-drift check

Resolves F2, F13. Gated on open question 2.

- New `[default-value-sync]` drift check: registry `default` values ==
  `_tokens.scss`/`_base.scss` literal `:root` values (allowlist for
  SCSS-computed bevel tones).
- Fix the existing `--link-primary-color` value drift as the check's first catch.
- If approved: flip SCSS + registry defaults to the High Contrast palette so
  first paint, DEFAULTS, and `detectMatchingPreset` all agree (High Contrast
  detected as active on fresh load).

Files: `drift-checks.ts`, `validate.ts`, `token-registry.ts`, `_tokens.scss`,
`themes` data, `drift-checks.test.ts`.

## Phase 3 — Link/button color model

Resolves F3, F4. Gated on open question 3.

- Redefine or drop `--link-primary-color`; fix all 9 themes' values so every
  style × color combination is legible on its own theme.
- Align the Links sidebar help text with the real wiring (link tokens drive the
  Button color axis, not just anchors).
- Registry labels renamed to match the decided semantics.

Files: `token-registry.ts`, `_tokens.scss`, `_components.scss`, `adminData.ts`,
`TokenSidebar.tsx`.

## Phase 4 — Warm-tone detector policy

Resolves F7. Gated on open question 4 (recommended: remove).

- Remove (or scope) `isWarmHex`/`autoFixWarmTones`/`WarmTonesWarning` and the
  related state in `useDesignVars`; delete dead colorUtils if removal wins.

Files: `useDesignVars.ts`, `TokenSidebar.tsx`, `colorUtils.ts`,
`useHomeDesignPanel.ts`, `types/design-vars.ts`.

## Phase 5 — Single design-vars state + honest theme swatches

Resolves F6, F8, and the design-vars half of F26.

- `DesignVarsProvider` context at the app root; `useDesignVars` becomes a
  consumer. Admin's nested `<Main>` and Home share one state — one `:root`
  writer, one localStorage writer, panels never diverge.
- Theme selector swatches render from the _preset's_ vars (full palette:
  colors + link + button fill), not the live map.

Files: new `DesignVarsProvider`, `useDesignVars.ts`, `App.tsx`, `Admin.tsx`,
`useHomeDesignPanel.ts`, `TokenPresets.tsx`.

## Phase 6 — Registry-driven control engine

Resolves F9, F11-adjacent typing (mechanism/policy per the review doc).

- One `TokenControl` renderer interprets the registry `ControlType`
  (color/range/ms/pct + unit/step) — replaces `RangeControl`, `PxSlider`,
  `RawSlider`, `MsSlider`, `PctSlider`. No god-function: pure value↔position
  converters (`sliderValue.ts`, the mechanism) stay separate from the registry
  descriptor (the policy).
- Drop unused `ControlType` members (`shadow`, `angle`).
- Narrow `CSSTokenMap` keys to registry cssVars where practical (supports the
  future package-extraction goal).

Files: `TokenControls.tsx`, `TokenSidebarExtra.tsx`, `token-registry.ts`,
`token-sidebar-data.ts`, `types/admin.ts`.

## Phase 7 — Hardcoded-style sweep

Resolves F10, F12, F45. Partly gated on open question 14 (font family).

- Wire the Button size axis to the font scale (or document each literal as an
  intentional fixed micro-size — every survivor gets a one-line justification;
  the sweep's output is an explicit exemption list, not silence).
- Replace stray chrome literals (`rgba(128,128,128,0.08)` etc.) with tokens.
- Font family: tokenize or declare constant per Ian; either way remove the
  duplicate literals and address the render-blocking Google Fonts `<link>`
  (self-host or preload).

Files: `_components.scss`, `_base.scss`, `_tokens.scss`, `token-registry.ts`
(if tokenized), `index.html`.

## Risks

- Phase 1 touches every visitor's stored state — migration must not nuke a
  user's customizations (diff format preserves them by construction).
- Phase 2's default flip changes the public site's look — Ian reviews visually
  before deploy.
- Phase 5 is the largest structural change; StrictMode + the flash script make
  ordering subtle. Peer review must specifically probe first-paint behavior.

## Verification (every phase)

`npm run check` + `npm run build` + `npm test`; manual pass on `/` and
`/design-system` incl. hard refresh with stale localStorage seeded via devtools.
