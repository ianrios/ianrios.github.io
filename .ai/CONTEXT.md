Type: Personal portfolio SPA at ianrios.me with a live-editable design system
at /design-system
Deployment: Firebase Hosting via `npm run deploy` (gated: check + test + build)
Backend: none

Facts live in their source files, not here:

- Toolchain, commands, gotchas: CLAUDE.md, package.json
- Design tokens (single source of truth): src/styles/token-registry.ts
- Current phase and priorities: .ai/WORK.md
- Process: .ai/WORKFLOW.md, .ai/RULES.md

Constraints:

- Frontend-only, no paid backend services
- SCSS with design tokens only; invariants in .ai/WORKFLOW.md
