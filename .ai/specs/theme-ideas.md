# Theme system — future ideas (Ian, 2026-07-06)

Not scheduled. Captured so the persistence/theme architecture never blocks them.
The stored shape `{ version, theme, overrides, snapshot }` and the
`DEFAULT_THEME` constant were designed with these in mind.

- **Change the default theme later** — edit `DEFAULT_THEME`; the
  `[default-value-sync]` check lists every SCSS literal that must follow.
- **Random theme per new visitor** — pick at first load, write it as `theme`
  in storage; returning visitors keep their pick.
- **Scroll-driven theme swap** — apply themes as the user scrolls; only
  persist if the user opts in.
- **Theme interpolation dial** — replace/augment the theme select with a dial
  that blends numerically between adjacent presets (colors interpolate in HSL,
  px/ms values linearly). Requires themes to stay complete (every editable
  token set — already enforced by `[preset-token]`/`[theme-control]`).

Constraint for all of the above: the flash script only ever replays the
`snapshot`, so any runtime theme trickery must re-persist a fresh snapshot to
avoid first-paint mismatch.
