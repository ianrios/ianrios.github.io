import type {
  CSSTokenMap,
  Preset,
  CardGridItem,
  NavSection,
} from '../../types/admin';
import { REGISTRY_DEFAULTS } from '../../styles/token-registry';

// ── Complete theme presets ────────────────────────────────────────────────
// One click sets EVERY editable category at once: colors, chrome, links,
// button colors + geometry, spacing, radii, typography, motion, layout, and
// the parametric depth geometry (distance/blur/intensity/contrast — this is how
// themes span hard Classic-Windows bevel ↔ soft neumorphism). Themes never
// write the eight derived `--bevel-*` tone colors: applyTheme recomputes those
// from the theme's bg/surface + depth-contrast. `theme()` requires every field,
// so a theme cannot silently omit a token (mirrored by the [preset-token] drift
// check and the themes unit test). Bevel needs bg/surface lightness separation
// to read, so each palette keeps a visible step between the two.

type Triple = readonly [string, string, string];
type SpaceScale = readonly [string, string, string, string, string, string];
type FontScale = readonly [string, string, string, string, string, string];

interface ThemeSpec {
  name: string;
  // colors + chrome
  bg: string;
  surface: string;
  accent: string;
  muted: string;
  text: string;
  border: string;
  overlay: string;
  // links
  link: string;
  linkHover: string;
  linkActive: string;
  // button colors
  btnPrimaryBg: string;
  btnPrimaryText: string;
  // spacing (xxs..xl) + radii (sm/md/lg)
  space: SpaceScale;
  radius: Triple;
  // button geometry
  btnPadY: string;
  btnPadX: string;
  btnRadius: string;
  // typography (xxs..xl) + weights + line heights
  font: FontScale;
  fontWeightBase: string;
  fontWeightHeading: string;
  lineBase: string;
  lineLoose: string;
  // motion
  anim: string;
  animSlow: string;
  // layout
  sidebar: string;
  drawer: string;
  modal: string;
  // depth geometry
  depthDistance: string;
  depthBlur: string;
  depthIntensity: string;
  depthContrast: string;
  // focus
  focusRing: string;
  focusWidth: string;
  // effects (0 = off): custom cursor size, trailing ring size, grain
  // overlay opacity, grain-follows-cursor intensity
  cursorSize: string;
  cursorTrail: string;
  textureOpacity: string;
  textureReactivity: string;
}

const theme = (s: ThemeSpec): Preset => ({
  name: s.name,
  vars: {
    '--color-bg': s.bg,
    '--color-surface': s.surface,
    '--color-accent': s.accent,
    '--color-muted': s.muted,
    '--color-text': s.text,
    '--border-color': s.border,
    '--overlay-bg': s.overlay,
    '--link-color': s.link,
    '--link-hover': s.linkHover,
    '--link-active': s.linkActive,
    '--btn-primary-bg': s.btnPrimaryBg,
    '--btn-primary-text': s.btnPrimaryText,
    '--space-xxs': s.space[0],
    '--space-xs': s.space[1],
    '--space-sm': s.space[2],
    '--space-md': s.space[3],
    '--space-lg': s.space[4],
    '--space-xl': s.space[5],
    '--radius-sm': s.radius[0],
    '--radius-md': s.radius[1],
    '--radius-lg': s.radius[2],
    '--btn-padding-y': s.btnPadY,
    '--btn-padding-x': s.btnPadX,
    '--btn-radius': s.btnRadius,
    '--font-xxs': s.font[0],
    '--font-xs': s.font[1],
    '--font-sm': s.font[2],
    '--font-base': s.font[3],
    '--font-lg': s.font[4],
    '--font-xl': s.font[5],
    '--font-weight-base': s.fontWeightBase,
    '--font-weight-heading': s.fontWeightHeading,
    '--line-height-base': s.lineBase,
    '--line-height-loose': s.lineLoose,
    '--anim-speed': s.anim,
    '--anim-speed-slow': s.animSlow,
    '--sidebar-width': s.sidebar,
    '--drawer-width': s.drawer,
    '--modal-max-width': s.modal,
    '--depth-distance': s.depthDistance,
    '--depth-blur': s.depthBlur,
    '--depth-intensity': s.depthIntensity,
    '--depth-contrast': s.depthContrast,
    '--focus-ring-color': s.focusRing,
    '--focus-ring-width': s.focusWidth,
    '--cursor-size': s.cursorSize,
    '--cursor-trail': s.cursorTrail,
    '--texture-opacity': s.textureOpacity,
    '--texture-reactivity': s.textureReactivity,
  },
});

// The theme every new visitor gets. Its vars equal the registry defaults and
// the SCSS first paint — enforced by [default-value-sync]. Change the default
// by editing this constant; the check lists every value that must follow.
export const DEFAULT_THEME = 'High Contrast';

export const THEMES: Preset[] = [
  // Bevel-leaning terminal green with slight softness.
  theme({
    name: 'Terminal',
    bg: '#0a0e0a',
    surface: '#0f1a0f',
    accent: '#1a3a1a',
    muted: '#4a7c4a',
    text: '#39ff14',
    border: 'rgba(128, 128, 128, 0.12)',
    overlay: 'rgba(0, 0, 0, 0.55)',
    link: '#00ffaa',
    linkHover: '#fff800',
    linkActive: '#ff3300',
    btnPrimaryBg: '#39ff14',
    btnPrimaryText: '#060e06',
    space: ['4px', '8px', '20px', '32px', '56px', '64px'],
    radius: ['8px', '16px', '24px'],
    btnPadY: '16px',
    btnPadX: '40px',
    btnRadius: '12px',
    font: ['10px', '12px', '14px', '16px', '18px', '22px'],
    fontWeightBase: '400',
    fontWeightHeading: '700',
    lineBase: '1.5',
    lineLoose: '1.6',
    anim: '0.12s',
    animSlow: '0.5s',
    sidebar: '220px',
    drawer: '280px',
    modal: '700px',
    depthDistance: '2px',
    depthBlur: '3px',
    depthIntensity: '0.6',
    depthContrast: '1',
    focusRing: 'rgba(57,255,20,0.15)',
    focusWidth: '4px',
    cursorSize: '10px',
    cursorTrail: '16px',
    textureOpacity: '0.1',
    textureReactivity: '0.35',
  }),
  // Crisp Windows 95 — hard bevel (blur 0), squared corners, neutral silver.
  theme({
    name: 'Classic Bevel',
    bg: '#c3c7cb',
    surface: '#dadde1',
    accent: '#b0b4b8',
    muted: '#6d7177',
    text: '#1a1d20',
    border: 'rgba(0,0,0,0.35)',
    overlay: 'rgba(0,0,0,0.45)',
    link: '#0a3a8c',
    linkHover: '#5a2d91',
    linkActive: '#8c1a1a',
    btnPrimaryBg: '#b0b4b8',
    btnPrimaryText: '#1a1d20',
    space: ['2px', '6px', '10px', '16px', '24px', '32px'],
    radius: ['0px', '2px', '2px'],
    btnPadY: '4px',
    btnPadX: '12px',
    btnRadius: '0px',
    font: ['10px', '11px', '12px', '13px', '15px', '17px'],
    fontWeightBase: '400',
    fontWeightHeading: '700',
    lineBase: '1.3',
    lineLoose: '1.4',
    anim: '0.06s',
    animSlow: '0.2s',
    sidebar: '180px',
    drawer: '240px',
    modal: '560px',
    depthDistance: '1px',
    depthBlur: '0px',
    depthIntensity: '1',
    depthContrast: '1',
    focusRing: 'rgba(0,0,0,0.45)',
    focusWidth: '2px',
    cursorSize: '8px',
    cursorTrail: '14px',
    textureOpacity: '0',
    textureReactivity: '0',
  }),
  // Soft neumorphism — high blur/distance, low-contrast monochrome, rounded.
  theme({
    name: 'Soft Neu',
    bg: '#e0e5ec',
    surface: '#eaeef5',
    accent: '#d1d9e6',
    muted: '#9aa5b5',
    text: '#4a5568',
    border: 'rgba(120,130,150,0.18)',
    overlay: 'rgba(40,50,70,0.4)',
    link: '#5b7cba',
    linkHover: '#7a6bcc',
    linkActive: '#c0607a',
    btnPrimaryBg: '#cdd9ec',
    btnPrimaryText: '#4a5568',
    space: ['6px', '12px', '20px', '32px', '48px', '64px'],
    radius: ['14px', '24px', '36px'],
    btnPadY: '12px',
    btnPadX: '28px',
    btnRadius: '16px',
    font: ['11px', '13px', '15px', '17px', '20px', '24px'],
    fontWeightBase: '300',
    fontWeightHeading: '600',
    lineBase: '1.6',
    lineLoose: '1.7',
    anim: '0.3s',
    animSlow: '0.8s',
    sidebar: '240px',
    drawer: '300px',
    modal: '760px',
    depthDistance: '6px',
    depthBlur: '16px',
    depthIntensity: '0.5',
    depthContrast: '1.3',
    focusRing: 'rgba(91,124,186,0.3)',
    focusWidth: '4px',
    cursorSize: '12px',
    cursorTrail: '22px',
    textureOpacity: '0',
    textureReactivity: '0',
  }),
  // Brutalist — zero radii, chunky spacing, hard offset shadow, raw links.
  theme({
    name: 'Brutalist',
    bg: '#fafafa',
    surface: '#ffffff',
    accent: '#ff5500',
    muted: '#444444',
    text: '#0a0a0a',
    border: 'rgba(0,0,0,0.9)',
    overlay: 'rgba(0,0,0,0.7)',
    link: '#0000ee',
    linkHover: '#ee0000',
    linkActive: '#aa00aa',
    btnPrimaryBg: '#1a1a1a',
    btnPrimaryText: '#fafafa',
    space: ['4px', '8px', '16px', '40px', '64px', '96px'],
    radius: ['0px', '0px', '0px'],
    btnPadY: '10px',
    btnPadX: '20px',
    btnRadius: '0px',
    font: ['12px', '14px', '18px', '22px', '30px', '40px'],
    fontWeightBase: '700',
    fontWeightHeading: '900',
    lineBase: '1.2',
    lineLoose: '1.3',
    anim: '0s',
    animSlow: '0s',
    sidebar: '200px',
    drawer: '260px',
    modal: '800px',
    depthDistance: '4px',
    depthBlur: '0px',
    depthIntensity: '1',
    depthContrast: '1.8',
    focusRing: '#ff5500',
    focusWidth: '4px',
    cursorSize: '12px',
    cursorTrail: '20px',
    textureOpacity: '0.14',
    textureReactivity: '0.4',
  }),
  // High Contrast — accessibility-leaning: black field, high-vis yellow CTA.
  theme({
    name: 'High Contrast',
    bg: '#000000',
    surface: '#101010',
    accent: '#1f1f1f',
    muted: '#c0c0c0',
    text: '#ffffff',
    border: 'rgba(255,255,255,0.6)',
    overlay: 'rgba(0,0,0,0.85)',
    link: '#4da6ff',
    linkHover: '#ffff00',
    linkActive: '#ff6666',
    btnPrimaryBg: '#ffe000',
    btnPrimaryText: '#000000',
    space: ['4px', '8px', '16px', '24px', '40px', '56px'],
    radius: ['0px', '0px', '0px'],
    btnPadY: '10px',
    btnPadX: '24px',
    btnRadius: '0px',
    font: ['12px', '14px', '16px', '18px', '22px', '28px'],
    fontWeightBase: '400',
    fontWeightHeading: '700',
    lineBase: '1.5',
    lineLoose: '1.6',
    anim: '0.1s',
    animSlow: '0.3s',
    sidebar: '220px',
    drawer: '280px',
    modal: '700px',
    depthDistance: '2px',
    depthBlur: '0px',
    depthIntensity: '1',
    depthContrast: '2',
    focusRing: '#ffff00',
    focusWidth: '4px',
    cursorSize: '10px',
    cursorTrail: '16px',
    textureOpacity: '0',
    textureReactivity: '0',
  }),
  // Paper — light, warm, refined: subtle radii, gentle low-intensity depth.
  theme({
    name: 'Paper',
    bg: '#f4f0e8',
    surface: '#faf7f2',
    accent: '#e8dcc8',
    muted: '#9e9080',
    text: '#2a2018',
    border: 'rgba(120,90,40,0.18)',
    overlay: 'rgba(60,45,20,0.4)',
    link: '#6b3a2a',
    linkHover: '#9b5a10',
    linkActive: '#8b0000',
    btnPrimaryBg: '#e8dcc8',
    btnPrimaryText: '#2a2018',
    space: ['3px', '6px', '12px', '20px', '32px', '44px'],
    radius: ['4px', '8px', '12px'],
    btnPadY: '8px',
    btnPadX: '18px',
    btnRadius: '6px',
    font: ['11px', '13px', '15px', '17px', '20px', '24px'],
    fontWeightBase: '400',
    fontWeightHeading: '600',
    lineBase: '1.6',
    lineLoose: '1.8',
    anim: '0.2s',
    animSlow: '0.6s',
    sidebar: '200px',
    drawer: '260px',
    modal: '640px',
    depthDistance: '1px',
    depthBlur: '2px',
    depthIntensity: '0.3',
    depthContrast: '0.8',
    focusRing: 'rgba(150,100,40,0.3)',
    focusWidth: '3px',
    cursorSize: '8px',
    cursorTrail: '13px',
    textureOpacity: '0.06',
    textureReactivity: '0.2',
  }),
  // Glow — funky neon on near-black, distance 0 + big blur for a halo.
  theme({
    name: 'Glow',
    bg: '#0a0014',
    surface: '#16092c',
    accent: '#2a0a4a',
    muted: '#8a6abf',
    text: '#f0e0ff',
    border: 'rgba(180,100,255,0.3)',
    overlay: 'rgba(10,0,30,0.7)',
    link: '#00ffee',
    linkHover: '#ff44cc',
    linkActive: '#ffee00',
    btnPrimaryBg: '#ff00cc',
    btnPrimaryText: '#14001f',
    space: ['5px', '10px', '22px', '36px', '56px', '80px'],
    radius: ['10px', '18px', '28px'],
    btnPadY: '12px',
    btnPadX: '28px',
    btnRadius: '24px',
    font: ['11px', '13px', '15px', '18px', '24px', '30px'],
    fontWeightBase: '400',
    fontWeightHeading: '700',
    lineBase: '1.5',
    lineLoose: '1.6',
    anim: '0.4s',
    animSlow: '1s',
    sidebar: '240px',
    drawer: '320px',
    modal: '820px',
    depthDistance: '0px',
    depthBlur: '20px',
    depthIntensity: '0.8',
    depthContrast: '1.5',
    focusRing: 'rgba(255,0,204,0.5)',
    focusWidth: '4px',
    cursorSize: '14px',
    cursorTrail: '24px',
    textureOpacity: '0',
    textureReactivity: '0.3',
  }),
  // Pillow — funky extreme soft-neu: pastel, max radii, the softest depth.
  theme({
    name: 'Pillow',
    bg: '#f3eefa',
    surface: '#fbf6ff',
    accent: '#e8d8f5',
    muted: '#b0a0c8',
    text: '#5a4a6e',
    border: 'rgba(150,130,180,0.2)',
    overlay: 'rgba(60,40,80,0.4)',
    link: '#9a7fd0',
    linkHover: '#d07fb0',
    linkActive: '#d09a7f',
    btnPrimaryBg: '#e8d8f5',
    btnPrimaryText: '#5a4a6e',
    space: ['8px', '14px', '28px', '44px', '72px', '104px'],
    radius: ['24px', '40px', '48px'],
    btnPadY: '16px',
    btnPadX: '40px',
    btnRadius: '50px',
    font: ['12px', '14px', '16px', '19px', '24px', '30px'],
    fontWeightBase: '300',
    fontWeightHeading: '600',
    lineBase: '1.6',
    lineLoose: '1.7',
    anim: '0.5s',
    animSlow: '1.2s',
    sidebar: '260px',
    drawer: '340px',
    modal: '880px',
    depthDistance: '8px',
    depthBlur: '24px',
    depthIntensity: '0.5',
    depthContrast: '1.2',
    focusRing: 'rgba(154,127,208,0.4)',
    focusWidth: '6px',
    cursorSize: '12px',
    cursorTrail: '18px',
    textureOpacity: '0',
    textureReactivity: '0',
  }),
  // Maximal — funky and loud: clashing color, ceiling spacing, dramatic depth.
  theme({
    name: 'Maximal',
    bg: '#1a0033',
    surface: '#2a0a4a',
    accent: '#ff0099',
    muted: '#b060ff',
    text: '#ffee00',
    border: 'rgba(255,0,153,0.4)',
    overlay: 'rgba(20,0,50,0.7)',
    link: '#00eeff',
    linkHover: '#ff0099',
    linkActive: '#ffee00',
    btnPrimaryBg: '#ff0099',
    btnPrimaryText: '#1a0033',
    space: ['6px', '12px', '24px', '48px', '80px', '128px'],
    radius: ['16px', '32px', '48px'],
    btnPadY: '18px',
    btnPadX: '48px',
    btnRadius: '20px',
    font: ['13px', '16px', '20px', '26px', '36px', '48px'],
    fontWeightBase: '700',
    fontWeightHeading: '900',
    lineBase: '1.4',
    lineLoose: '1.5',
    anim: '0.3s',
    animSlow: '0.9s',
    sidebar: '300px',
    drawer: '400px',
    modal: '1100px',
    depthDistance: '5px',
    depthBlur: '8px',
    depthIntensity: '0.9',
    depthContrast: '1.6',
    focusRing: '#ff0099',
    focusWidth: '6px',
    cursorSize: '16px',
    cursorTrail: '28px',
    textureOpacity: '0.12',
    textureReactivity: '0.5',
  }),
];

// Derived from the canonical token registry so every :root var (not just the
// hand-listed subset) is reset/exported. Enforced by [defaults-sync].
export const DEFAULTS: CSSTokenMap = REGISTRY_DEFAULTS;

// Persistence lives in ./designStorage.ts (this file stays data-only).

// Single-component demo fixtures moved into the colocated *.demo.tsx files
// (2.6 #3) - demos are self-contained. Only multi-component PATTERN data
// consumed by the preview/combination pages remains here.

export const CARD_GRID_DATA: CardGridItem[] = [
  {
    title: 'BAFConX',
    desc: 'Fan configurator',
    tools: ['Flutter', 'Redux', 'Python'],
  },
  {
    title: 'SpecLab',
    desc: '3D spectroscopy',
    tools: ['Three.js', 'React', 'GraphQL'],
  },
  {
    title: 'Funnel',
    desc: 'Sales pipeline',
    tools: ['React', 'TypeScript', 'D3'],
  },
];

export const VERTICAL_NAV_SECTIONS: NavSection[] = [
  {
    id: 'experience',
    label: 'Experience',
    items: [
      { id: 'built', label: 'Built Technologies' },
      { id: 'prev', label: 'Previous Co' },
    ],
  },
  {
    id: 'projects',
    label: 'Projects',
    items: [
      { id: 'speclab', label: 'SpecLab' },
      { id: 'bafconx', label: 'BAFConX' },
    ],
  },
  {
    id: 'hobbies',
    label: 'Hobbies',
    items: [
      { id: 'music', label: 'Music' },
      { id: '3d', label: '3D / WebGL' },
    ],
  },
];
