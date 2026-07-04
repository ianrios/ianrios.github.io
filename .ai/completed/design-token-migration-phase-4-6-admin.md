# Phases 4–6 — Admin Panel Cleanup

Part of epic: `design-token-inline-style-migration.md`

---

## Phase 4 — Delete preview.scss + fix admin className leaks

### Delete `src/pages/admin/preview.scss`

Migrate all 7 classes to `_components.scss` with `skeu-` prefix:

| Old class                     | New class                          |
| ----------------------------- | ---------------------------------- |
| `.preview-flex`               | `.skeu-preview-flex`               |
| `.preview-flex--end`          | `.skeu-preview-flex--end`          |
| `.preview-note`               | `.skeu-preview-note`               |
| `.preview-page-frame`         | `.skeu-preview-page-frame`         |
| `.preview-page-frame--dashed` | `.skeu-preview-page-frame--dashed` |
| `.preview-icon-entry`         | `.skeu-preview-icon-entry`         |
| `.preview-icon-label`         | `.skeu-preview-icon-label`         |

Update imports in all files that import `preview.scss`:
`AtomsSection.tsx`, `MoleculesSection.tsx`, `OrganismsSection.tsx`,
`ButtonAtoms.tsx`, `ButtonHelpers.tsx`, `CombinationsSection.tsx`,
`BasicCombinations.tsx`, `LayoutCombinations.tsx`, `OrgCombinations.tsx`,
`IconAtoms.tsx`, `PushPanelVariants.tsx`.

### Fix `MoleculesSection.tsx` className bug

Line 125: `className={variant ?? undefined}` passes raw CSS class string `'skeu-card--accent'`
to `<Card>`. After Phase 2 updates `adminData.ts`, this becomes `variant={v.variant}` (typed prop).

### Fix remaining raw HTML in admin

`ButtonAtoms.tsx`, `ButtonHelpers.tsx` — after `adminData.ts` migration:
render `<Button variant={v.variant} size={v.size}>` not raw `<button className={cls}>`.

`OrgCombinations.tsx`, `BasicCombinations.tsx`, `LayoutCombinations.tsx` —
replace raw `<div className="skeu-card">` with `<Card>`.

### Add Design Tokens section

Create `src/pages/admin/preview/TokensSection.tsx`.
This section renders above Atoms in `Admin.tsx`.

Displays all current token values as read-only swatches/type specimens:

- **Colors:** a filled swatch + hex label for each `--color-*` custom property
- **Typography:** font-xxs through font-lg displayed as live text specimens
- **Spacing:** a bar scaled to token value for each `--space-*`
- **Radii, shadows:** visual specimen for each
- **Motion:** animated example using `--anim-speed-fast` / `--anim-speed-slow`

All rendering uses `<Card>`, `<Badge>`, atoms only. No raw HTML. The token values are
read from CSS (`getComputedStyle(document.documentElement)`) at render time so they
update live as the admin sliders change.

---

## Phase 5 — Admin token controls

Add missing sliders to `src/pages/admin/TokenSidebar.tsx`:

**Typography** (new section):

- `--line-height-base` slider (unit: unitless, range 1.2–2.0, step 0.05)
- `--line-height-loose` slider

**Layout** (add to existing section):

- `--sidebar-width` slider (unit: px, range 160–400)
- `--drawer-width` slider (unit: px, range 160–400)

**Motion** (add to existing section):

- `--anim-speed-fast` slider (already used in SCSS, missing from admin)
- `--anim-speed-slow` slider

**Spacing for slider rows:** Existing rows use `style={{ marginBottom: 8 }}` inline.
Add `.skeu-control-row { margin-bottom: var(--space-xs); }` to `_components.scss`.
Apply `.skeu-control-row` to every slider row in this file — including pre-existing ones.
Do not perpetuate the inline pattern.

---

## Phase 6 — Admin internal inline style cleanup

Replace all raw pixel values with token vars across all 18 admin files.
Files changed: `AtomsSection.tsx`, `MoleculesSection.tsx`, `OrganismsSection.tsx`,
`ButtonAtoms.tsx`, `ButtonHelpers.tsx`, `BasicCombinations.tsx`, `CombinationsSection.tsx`,
`LayoutCombinations.tsx`, `OrgCombinations.tsx`, `IconAtoms.tsx`, `PushPanelVariants.tsx`,
`TokenSidebar.tsx`, `TokensSection.tsx`, `Admin.tsx`.

Rules:

- All layout uses `skeu-*` classes and token CSS vars
- No hardcoded margins, gaps, font sizes
- No raw `<div style={{...}}>` wrappers; use `<Card padding="xs">` etc.
- `Admin.tsx` section headings use `<h2 className="skeu-admin-section-heading">` not inline size/margin
