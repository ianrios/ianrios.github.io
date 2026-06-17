export const ELEVATION_PRESETS = {
  low: "0 2px 6px rgba(0,0,0,0.06)",
  med: "0 8px 20px rgba(0,0,0,0.14)",
  high: "0 20px 48px rgba(0,0,0,0.26)",
};

export const detectElevationLevel = (val) => {
  const trimmed = (val || "").trim();
  for (const [k, v] of Object.entries(ELEVATION_PRESETS)) {
    if (v === trimmed) return k;
  }
  return trimmed ? "custom" : "low";
};

// Chrome: the only per-preset values NOT auto-derived from surface color.
// Pop-shadow positions are auto-computed in useDesignVars.applyColorPreset.
const LIGHT_CHROME = {
  "--btn-top-highlight":  "inset 0 1px 0 rgba(255,255,255,0.65)",
  "--btn-overlay-opacity": "0.92",
};
const DARK_CHROME = {
  "--btn-top-highlight":  "none",
  "--btn-overlay-opacity": "0.04",
};

// Per-theme link three-state colors (default / hover / active-click)
const mkLinks = (color, hover, active) => ({
  "--link-color":  color,
  "--link-hover":  hover,
  "--link-active": active,
});

export const COLOR_PRESETS = [
  { name: "Classic White",    vars: { "--color-bg": "#f8f9fa", "--color-surface": "#ffffff", "--color-accent": "#e9ecef", "--color-muted": "#adb5bd", "--color-text": "#212529", "--btn-text-color": "#212529", "--btn-gradient-start": "#f8f9fa", "--btn-gradient-end": "#e9ecef", "--focus-ring-color": "rgba(0,0,0,0.08)",        ...LIGHT_CHROME, ...mkLinks("#0066cc", "#cc6600", "#cc0000") } },
  { name: "Plastic",          vars: { "--color-bg": "#f5f6f7", "--color-surface": "#ffffff", "--color-accent": "#eaf0f4", "--color-muted": "#9aa3ab", "--color-text": "#1f2933", "--btn-text-color": "#1f2933", "--btn-gradient-start": "#f2f6f9", "--btn-gradient-end": "#dbe5ea", "--focus-ring-color": "rgba(60,120,180,0.10)",   ...LIGHT_CHROME, ...mkLinks("#0077ff", "#ff8800", "#cc0000") } },
  { name: "Warm Cream",       vars: { "--color-bg": "#fdf6ec", "--color-surface": "#fffdf7", "--color-accent": "#f5e6c8", "--color-muted": "#b8a48a", "--color-text": "#3d2b1f", "--btn-text-color": "#3d2b1f", "--btn-gradient-start": "#fdf0dc", "--btn-gradient-end": "#f0ddb8", "--focus-ring-color": "rgba(180,120,60,0.12)",   ...LIGHT_CHROME, ...mkLinks("#8b4513", "#c8860a", "#8b0000") } },
  { name: "Paper",            vars: { "--color-bg": "#f4f0e8", "--color-surface": "#faf7f2", "--color-accent": "#e8dcc8", "--color-muted": "#9e9080", "--color-text": "#2a2018", "--btn-text-color": "#2a2018", "--btn-gradient-start": "#f0ebe0", "--btn-gradient-end": "#e0d8c8", "--focus-ring-color": "rgba(80,60,20,0.10)",     ...LIGHT_CHROME, ...mkLinks("#6b3a2a", "#9b5a10", "#8b0000") } },
  { name: "Dark",             vars: { "--color-bg": "#0d1117", "--color-surface": "#161b22", "--color-accent": "#21262d", "--color-muted": "#8b949e", "--color-text": "#c9d1d9", "--btn-text-color": "#c9d1d9", "--btn-gradient-start": "#21262d", "--btn-gradient-end": "#161b22", "--focus-ring-color": "rgba(88,166,255,0.15)",   ...DARK_CHROME,  ...mkLinks("#4da6ff", "#ffdd00", "#ff4444") } },
  { name: "Slate",            vars: { "--color-bg": "#1e2a3a", "--color-surface": "#243044", "--color-accent": "#2e3f55", "--color-muted": "#6b7f95", "--color-text": "#d4dde8", "--btn-text-color": "#d4dde8", "--btn-gradient-start": "#2e3f55", "--btn-gradient-end": "#243044", "--focus-ring-color": "rgba(120,180,255,0.18)",  ...DARK_CHROME,  ...mkLinks("#66aaff", "#ffcc44", "#ff5555") } },
  { name: "Terminal",         vars: { "--color-bg": "#0a0e0a", "--color-surface": "#0f1a0f", "--color-accent": "#1a3a1a", "--color-muted": "#4a7c4a", "--color-text": "#39ff14", "--btn-text-color": "#060e06", "--btn-gradient-start": "#39ff14", "--btn-gradient-end": "#1e8a00", "--focus-ring-color": "rgba(57,255,20,0.15)",    ...DARK_CHROME,  ...mkLinks("#00ffaa", "#fff800", "#ff3300") } },
  { name: "Candy",            vars: { "--color-bg": "#fff0f8", "--color-surface": "#ffffff", "--color-accent": "#ffb3de", "--color-muted": "#cc88b4", "--color-text": "#4a0a3a", "--btn-text-color": "#4a0a3a", "--btn-gradient-start": "#ffe0f4", "--btn-gradient-end": "#ffb3de", "--focus-ring-color": "rgba(255,100,200,0.20)",  ...LIGHT_CHROME, ...mkLinks("#cc0088", "#ff66cc", "#aa0055") } },
  { name: "Neon",             vars: { "--color-bg": "#08080f", "--color-surface": "#10101c", "--color-accent": "#1a0a3a", "--color-muted": "#6060aa", "--color-text": "#e8e0ff", "--btn-text-color": "#e8e0ff", "--btn-gradient-start": "#1a0a3a", "--btn-gradient-end": "#10101c", "--focus-ring-color": "rgba(180,100,255,0.25)",  ...DARK_CHROME,  ...mkLinks("#aa66ff", "#ff66aa", "#ff3366") } },
  // Nuclear Fallout — also carries shadow-angle, anim-speed, focus-ring-width since they're part of the theme identity
  { name: "Nuclear Fallout",  vars: {
    "--color-bg": "#0a0e0a", "--color-surface": "#1c2a0c", "--color-accent": "#4b4e1e",
    "--color-muted": "#a8a800", "--color-text": "#fff800",
    "--btn-text-color": "#fff800", "--btn-gradient-start": "#363911", "--btn-gradient-end": "#1f2000",
    "--focus-ring-color": "#acb201", "--focus-ring-width": "2px",
    "--shadow-angle": "293", "--anim-speed": "0.72s",
    ...DARK_CHROME,
    ...mkLinks("#acb201", "#fff800", "#ff4400"),
  }},
];

export const SHAPE_PRESETS = [
  { name: "Plastic",          vars: { "--space-sm": "12px", "--space-md": "16px", "--space-lg": "24px", "--radius-sm": "4px",  "--radius-md": "8px",  "--radius-lg": "12px", "--btn-padding-y": "6px",  "--btn-padding-x": "12px", "--btn-radius": "6px",  "--btn-elevation": ELEVATION_PRESETS.low  } },
  { name: "Flat",             vars: { "--space-sm": "8px",  "--space-md": "12px", "--space-lg": "16px", "--radius-sm": "0px",  "--radius-md": "0px",  "--radius-lg": "0px",  "--btn-padding-y": "6px",  "--btn-padding-x": "12px", "--btn-radius": "0px",  "--btn-elevation": "none"                 } },
  { name: "Compact",          vars: { "--space-sm": "4px",  "--space-md": "8px",  "--space-lg": "12px", "--radius-sm": "2px",  "--radius-md": "4px",  "--radius-lg": "6px",  "--btn-padding-y": "3px",  "--btn-padding-x": "8px",  "--btn-radius": "3px",  "--btn-elevation": ELEVATION_PRESETS.low  } },
  { name: "Airy",             vars: { "--space-sm": "16px", "--space-md": "24px", "--space-lg": "40px", "--radius-sm": "6px",  "--radius-md": "12px", "--radius-lg": "20px", "--btn-padding-y": "10px", "--btn-padding-x": "20px", "--btn-radius": "10px", "--btn-elevation": ELEVATION_PRESETS.low  } },
  { name: "Pill",             vars: { "--space-sm": "12px", "--space-md": "20px", "--space-lg": "32px", "--radius-sm": "20px", "--radius-md": "24px", "--radius-lg": "32px", "--btn-padding-y": "10px", "--btn-padding-x": "24px", "--btn-radius": "50px", "--btn-elevation": ELEVATION_PRESETS.med  } },
  { name: "Bubble",           vars: { "--space-sm": "16px", "--space-md": "24px", "--space-lg": "48px", "--radius-sm": "16px", "--radius-md": "24px", "--radius-lg": "40px", "--btn-padding-y": "14px", "--btn-padding-x": "32px", "--btn-radius": "40px", "--btn-elevation": ELEVATION_PRESETS.high } },
  { name: "Chunky",           vars: { "--space-sm": "20px", "--space-md": "32px", "--space-lg": "56px", "--radius-sm": "8px",  "--radius-md": "16px", "--radius-lg": "24px", "--btn-padding-y": "16px", "--btn-padding-x": "40px", "--btn-radius": "12px", "--btn-elevation": ELEVATION_PRESETS.high } },
  { name: "Brutalist",        vars: { "--space-sm": "4px",  "--space-md": "16px", "--space-lg": "48px", "--radius-sm": "0px",  "--radius-md": "0px",  "--radius-lg": "0px",  "--btn-padding-y": "8px",  "--btn-padding-x": "16px", "--btn-radius": "0px",  "--btn-elevation": "4px 4px 0 rgba(0,0,0,0.85)" } },
  // Nuclear shape — tight, dense, no wasted space; pairs with Nuclear Fallout color preset
  { name: "Nuclear",          vars: { "--space-xxs": "5px", "--space-xs": "5px", "--space-sm": "11px", "--space-md": "12px", "--space-lg": "17px", "--radius-sm": "7px", "--radius-md": "14px", "--radius-lg": "16px", "--btn-padding-y": "7px", "--btn-padding-x": "19px", "--btn-radius": "10px", "--btn-elevation": ELEVATION_PRESETS.low } },
];

export const DEFAULTS = {
  "--color-bg":      "#0a0e0a",
  "--color-surface": "#0f1a0f",
  "--color-accent":  "#1a3a1a",
  "--color-muted":   "#4a7c4a",
  "--color-text":    "#39ff14",
  "--space-xxs": "4px",
  "--space-xs":  "8px",
  "--space-sm":  "20px",
  "--space-md":  "32px",
  "--space-lg":  "56px",
  "--radius-sm": "8px",
  "--radius-md": "16px",
  "--radius-lg": "24px",
  "--btn-padding-y":      "16px",
  "--btn-padding-x":      "40px",
  "--btn-gradient-start": "#39ff14",
  "--btn-gradient-end":   "#1e8a00",
  "--btn-text-color":     "#060e06",
  "--btn-radius":         "12px",
  "--btn-elevation":      ELEVATION_PRESETS.high,
  "--focus-ring-color":   "rgba(57,255,20,0.15)",
  "--focus-ring-width":   "4px",
  "--pop-shadow-light":        "-5px -5px 12px rgba(0,60,0,0.18)",
  "--pop-shadow-dark":         "5px 7px 16px rgba(0,0,0,0.55)",
  "--btn-top-highlight":       "none",
  "--btn-overlay-opacity":     "0.04",
  "--inset-shadow-highlight":  "-4px -4px 8px rgba(255,255,255,0.04)",
  "--shadow-angle": "315",
  "--anim-speed":   "0.12s",
  // Link three-state colors — Terminal defaults
  "--link-color":  "#00ffaa",
  "--link-hover":  "#fff800",
  "--link-active": "#ff3300",
};

export const loadStored = () => {
  try {
    const raw = window.localStorage.getItem("skeuomorph:vars");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Object.fromEntries(Object.entries(parsed).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v]));
  } catch { return null; }
};

export const detectMatchingPreset = (presets, currentVars) => {
  for (const p of presets) {
    if (Object.entries(p.vars).every(([k, v]) => currentVars[k] === v)) return p.name;
  }
  return null;
};

// Style variants only — size is a separate, orthogonal axis
export const BUTTON_VARIANTS = [
  { label: "Gradient", cls: "",                  desc: "base gradient — btn-fill-text" },
  { label: "Primary",  cls: "skeu-btn--primary", desc: "bold gradient — btn-fill-text" },
  { label: "Outline",  cls: "skeu-btn--outline", desc: "surface — color-text"          },
];

// Size variants — combine with any style above
export const BUTTON_SIZES = [
  { label: "xs",      cls: "skeu-btn--xs"  },
  { label: "sm",      cls: "skeu-btn--sm"  },
  { label: "md",      cls: ""              },
  { label: "lg",      cls: "skeu-btn--lg"  },
  { label: "xl",      cls: "skeu-btn--xl"  },
];

export const BADGE_SAMPLES = ["React", "TypeScript", "Three.js", "Python", "MySQL", "WebGL"];

export const CARD_GRID_DATA = [
  { title: "BAFConX", desc: "Fan configurator", tools: ["Flutter", "Redux", "Python"] },
  { title: "SpecLab", desc: "3D spectroscopy", tools: ["Three.js", "React", "GraphQL"] },
  { title: "Funnel", desc: "Sales pipeline", tools: ["React", "TypeScript", "D3"] },
];

export const ACCORDION_ITEMS = [
  { id: "exp", title: "Experience", body: "Detailed work history, key accomplishments, and technologies across roles." },
  { id: "proj", title: "Projects", body: "Personal and professional projects with live demos and source links." },
  { id: "edu", title: "Education", body: "Degrees, certifications, and self-directed learning." },
];

export const VERTICAL_NAV_SECTIONS = [
  { id: "experience", label: "Experience", items: [{ id: "built", label: "Built Technologies" }, { id: "prev", label: "Previous Co" }] },
  { id: "projects", label: "Projects", items: [{ id: "speclab", label: "SpecLab" }, { id: "bafconx", label: "BAFConX" }] },
  { id: "hobbies", label: "Hobbies", items: [{ id: "music", label: "Music" }, { id: "3d", label: "3D / WebGL" }] },
];

export const CARD_COLOR_VARIANTS = [
  { label: "default", variant: null,                text: "var(--color-text)" },
  { label: "accent",  variant: "skeu-card--accent", text: "var(--color-text)" },
  { label: "muted",   variant: "skeu-card--muted",  text: "var(--color-text)" },
];

export const TIMELINE_EVENTS = [
  { year: "2019", role: "Junior Dev", company: "Agency" },
  { year: "2021", role: "Frontend Eng", company: "MidCo" },
  { year: "2022", role: "Sr. Frontend", company: "Built" },
  { year: "2025", role: "Full Stack", company: "Built" },
];

export const V2_PROJECTS = [
  { title: "SpecLab", desc: "3D spectroscopy visualization", tools: ["Three.js", "React", "WebGL"], featured: true },
  { title: "BAFConX", desc: "Big fan configurator", tools: ["Flutter", "Redux"] },
  { title: "Funnel", desc: "Sales pipeline viz", tools: ["D3", "TypeScript"] },
];
