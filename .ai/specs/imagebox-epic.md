# ImageBox — Epic Spec

**Route:** `/imagebox`  
**Status:** Planning  
**Last updated:** 2026-06-09  
**Entry point:** Project card in the masonry grid on the main portfolio (alongside MetaSpheres and The Algorithm Knows Best)  
**Primary user:** Ian, but publicly accessible to anyone visiting ianrios.me  
**Rendering engine:** PixiJS / WebGL  
**Session persistence:** None — fresh slate on every page load  
**Input formats:** JPG, PNG  
**Output format:** PNG (always)

---

## What It Is

A novel in-browser photo editor where images are manipulated mathematically at the pixel level. Not a filter app — a pixel laboratory. The user uploads images, stacks them in layers, applies mathematical experiments per layer or globally, and downloads the result as a flattened PNG composite.

See `.ai/specs/imagebox-experiments.md` for the full running list of experiments to implement.

---

## Layer System

### Capacity

- 8 layers maximum per session

### Layer stack panel

The layer stack panel is intentionally **wider than a typical photo editor** — all common controls are exposed directly in the panel with no menu diving:

| Control             | Type                                    |
| ------------------- | --------------------------------------- |
| Visibility toggle   | Eye open / eye closed icon              |
| Opacity             | Slider                                  |
| Reorder             | Drag handle                             |
| Black & White       | Toggle                                  |
| Invert Colors       | Toggle                                  |
| Saturation          | Slider                                  |
| Experiment assigned | Label / badge (opens experiment config) |

### How layers interact

- Each layer **only affects the immediately visible layer beneath it** — not all layers below.
- If a layer's eye is closed, it is skipped as both a source and a target.
- "Merge layers" (also called "freeze and flatten") collapses a layer and its target-below into a single rasterized layer, freeing one layer bank slot.

### Export behavior

- **Default export:** Flattened composite PNG of all visible (eye-open) layers in stack order.
- **Export all layers individually:** Option to export each layer as its own PNG file.
- **No visible layers:** Exports a transparent PNG.
- No single-layer export UI needed — the user can solo a layer by toggling all others off.

---

## Experiments

Experiments are mathematical pixel transformations. They can be applied:

- **Per-layer** — each layer has its own experiment (and its own parameter set)
- **Globally** — a global experiment applied to the final composite before export

### MVP Experiments (implement first)

1. **Transparency Checkerboard / Layer Blending** — make every 3rd pixel in a 2×2 group transparent so the layer beneath leaks through
2. **Pixelation Slider (Mosaic)** — group pixels by average color into progressively larger blocks (NOT a blur)

### Full Experiment List

All listed in `.ai/specs/imagebox-experiments.md`. Each will eventually have its own sub-spec when it reaches implementation phase.

### Experiment UI pattern

- Presets (saved parameter configurations)
- Real-time sliders, knobs, and toggles
- All controls update the canvas live with no "apply" button

---

## Canvas & Viewport

### Interaction tools

- Zoom in / out
- Pan
- Rotate
- Skew
- Crop
- Flip horizontal / flip vertical
- Set image dimensions (width × height)
- Set canvas dimensions (independent of image)

### MVP canvas features (ship with Phase 1)

1. **Undo / redo** — full edit history, step backward/forward
2. **Checkerboard background** — standard transparency indicator (toggleable)
3. **Status bar** — shows cursor XY, pixel color under cursor (hex + rgb), zoom %
4. **Rotation snap** — hold shift to snap rotation to 45° increments
5. **Fit to window / 1:1 zoom** — keyboard shortcuts to reset the view

### Deferred canvas features (document, implement later)

- Magic wand / select by color
- Eyedropper / color sampler
- Rulers + drag guides
- History panel (visual list of states)
- Snap to grid

### Selection tool

- **Not in MVP.** All experiments apply to the whole layer.
- When added later: rect/lasso selection to constrain where an experiment applies.

---

## Design System

- Use the existing atomic design library in `/admin` (tokens, atoms, molecules)
- Add new design tokens, atoms, and molecules as needed for ImageBox-specific UI
- Components built for ImageBox should be designed for reuse across the app:
  - The **layer selector** component may be repurposed on the portfolio page to show/hide work categories (experience, projects, hobbies)
  - Knobs, sliders, and toggles should be atomic components reusable anywhere
- Follow the skeuomorphism spec (`src/styles/_tokens.scss`, `src/styles/_components.scss`)
- Do not introduce Bootstrap classes — use SCSS tokens only

---

## Architecture Notes

- New React route: add `/imagebox` to `src/App.js` alongside `/` and `/admin`
- New page file: `src/pages/ImageBox.js` (or `src/pages/Imagebox/index.js` if it grows large)
- PixiJS handles all canvas rendering — raw `ImageData` pixel manipulation runs in PixiJS filters or custom WebGL shaders
- No backend, no API, no auth
- All state is local React state / refs — nothing persists across sessions

---

## Epic Phases

This is an epic. Each phase below is agent-executable and produces a working increment. Phases may spawn their own sub-specs.

---

### Phase 0 — Route & Entry Point

**Goal:** `/imagebox` exists and is reachable. Project card appears in the masonry grid.

- Add `/imagebox` route to `src/App.js`
- Create `src/pages/ImageBox.js` — placeholder layout (header + empty canvas area + empty layer panel)
- Add ImageBox project card to `src/data.js`

No PixiJS yet.

---

### Phase 1 — Canvas Foundation

**Goal:** User can upload an image and see it rendered on a PixiJS canvas with basic viewport controls.

- Install and configure PixiJS; render canvas in ImageBox page
- Image upload (JPG/PNG only, single image)
- Zoom, pan, checkerboard background, status bar (XY + hex + zoom %), fit-to-window shortcut
- Undo/redo infrastructure (history stack)

No layer system yet. Validate pixel data is accessible (needed for Phase 4+ experiments).

---

### Phase 2 — Layer System (Structure)

**Goal:** Layer stack UI. User can upload up to 8 images and manage them as layers.

- Layer stack panel (wide, all controls inline): visibility toggle, opacity slider, drag to reorder
- Composite rendering: flatten visible layers in stack order
- "No visible layers" → transparent checkerboard
- Export button: flatten → PNG

---

### Phase 3 — Layer Controls

**Goal:** Each layer has its full set of native controls.

- Per-layer: B&W toggle, invert toggle, saturation slider — all real-time
- Rotation snap (shift key) for canvas rotate tool
- Flip horizontal / flip vertical per layer

---

### Phase 4 — First Experiments

**Goal:** Two experiments with real-time controls and presets.

1. **Transparency Checkerboard / Layer Blending** — slider for transparent pixel in 2×2 group
2. **Pixelation Mosaic Slider** — pixel blocks by average color; range slider for block size

- Design experiment UI: preset picker + parameter controls panel
- Implement both as PixiJS filters or custom shaders
- Per-layer experiment assignment; layer N affects only nearest visible layer below
- "Merge layers" / freeze and flatten

This phase establishes the experiment architecture all future experiments use. A sub-spec
may be needed before implementation.

---

### Phase 5 — Additional Experiments (batch 1)

**Goal:** Next experiments from `.ai/specs/imagebox-experiments.md`.

3. Repeating Pixel Strips — every N pixels duplicates the previous N
4. Nearest Color Quantization — shift each pixel to nearest color within pixel radius
5. Grid Section Averaging — X×Y grid; each cell becomes its average color

Each experiment needs its own sub-spec before implementation.

---

### Phase 6 — Additional Experiments (batch 2) + Global Experiment

**Goal:** Remaining experiments + global experiment layer.

6. Equation-Based Pixel Manipulation — math expression input, real-time pixel transforms
7. Grid Section Extremes — keep brightest / darkest / highest-contrast pixel per cell
8. Color Selection/Deletion in Grid Ranges

Global experiment: single experiment applied to the final composite post-flatten.

Experiment 6 requires a safe expression parser (e.g., `math.js`) — own sub-spec required.

---

### Phase 7 — Export & Upload Polish

- Export all layers individually (zip or sequential downloads)
- Multi-image upload → auto-populate layer stack; drag-and-drop
- Canvas dimensions control; image dimensions control per layer

---

### Phase 8 — Deferred Canvas Tools

- Eyedropper / color sampler
- Magic wand / select by color (tolerance slider)
- Rect + lasso selection; apply experiment to selection only
- Rulers + drag guides; snap to grid; history panel

---

### Phase 9 — Polish & Presets

- Keyboard shortcuts (document + implement)
- Presets system: save/load named parameter configs per experiment
- Performance audit (large images, 8 layers, real-time filters)
- Mobile consideration; update project card with screenshot

---

## Open Questions

- Should the equation-based experiment (Phase 6) use a text input with `math.js` eval, or a visual node graph? Text input is simpler; node graph is more powerful.
- Should presets be stored in localStorage (survives refresh) or session-only? Currently leaning localStorage for presets only since they're not image data.
- What should the ImageBox project card image look like? A screenshot of the tool in use, or a generated example of one of the pixel experiments?

---

## Related Files

- `.ai/specs/imagebox-experiments.md` — full running list of pixel experiments
- `src/App.js` — add route here
- `src/data.js` — add project card here
- `src/pages/Admin.js` — design system reference
- `src/styles/_tokens.scss` — SCSS tokens to use and extend
- `src/styles/_components.scss` — existing component patterns
