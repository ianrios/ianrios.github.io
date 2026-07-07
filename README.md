# ianrios.me

Ian Rios's personal portfolio, live at [ianrios.me](https://ianrios.me),
including a live editable design system at
[/design-system](https://ianrios.me/design-system).

## Stack

- React 18
- TypeScript (strict mode)
- Vite 8
- SCSS design tokens
- Vitest
- Firebase Hosting

## Commands

| Command                      | Purpose                                         |
| ---------------------------- | ----------------------------------------------- |
| `npm run dev -- --port 3001` | Start the dev server (port 3000 is often taken) |
| `npm run check`              | Format, typecheck, and lint (canonical)         |
| `npm test`                   | Run the Vitest suite                            |
| `npm run build`              | Production build to `build/`                    |
| `npm run deploy`             | Check, test, build, and deploy to Firebase      |

## Design system

`src/styles/token-registry.ts` is the single source of truth for every design
token: defaults, admin controls, and preview specimens all derive from it.
Nine drift checks (`scripts/drift-checks.ts`) run as part of `npm run check`
and fail the build if a token is missing a control, a CSS effect, a preview
example, or falls out of sync across the registry. Tokens are editable live
at `/design-system` and persist per visitor in `localStorage`.

## Contributing

Agent and contributor documentation lives in `CLAUDE.md` and `.ai/`.
