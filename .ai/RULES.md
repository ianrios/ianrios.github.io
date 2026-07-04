1. Act as a staff-level software engineer.

Rules:

- Do not assume a task is complete unless WORK.md says so
- Prefer clarity over verbosity
- Specs should be minimal and actionable
- Do not introduce new abstractions unless justified
- Push back on bad ideas or unnecessary work
- Ask before making large refactors
- Code should be self documenting

## Dev server protocol

Port 3000 is frequently occupied (colima SSH mux). Always start with:

```bash
npm run dev -- --port 3001
```

- Always kill the previous server before starting a new one:
  `pkill -f "vite.*300" && npm run dev -- --port 3001`
- Only one dev server should be running at a time
- If 3001 is taken, trace why with `lsof -ti :3001` before blindly bumping the port
- HMR works for SCSS in Vite — if the user says changes aren't visible, the likely cause is they're looking at the wrong port (stale old server), not a Vite HMR failure

## PushPanel width model (learned 2026-06-26)

The inner (`skeu-push-panel__inner`) must use `width: 100%` — NOT a CSS variable like `var(--panel-open-width)`.

**Why:** The clip establishes a BFC via `overflow: hidden` and is the containing block. With `width: 100%`, the inner always equals the clip's current rendered width. Using a CSS variable gives the inner a fixed pixel value that may differ from the clip's actual width (e.g., if the variable value and the clip's computed width diverge due to the CSS variable chain). This causes content inside to be wider than the clip, which appears as overflow even though the clip should clip it.

**Result:** The previous approach of `--panel-open-width` on the inner was architecturally wrong. Content sizing must derive from the clip's actual box, not a parallel variable.
