import type React from 'react';

export const COLOR_CONTROLS = [
  { label: 'Background', varName: '--color-bg' },
  { label: 'Surface', varName: '--color-surface' },
  { label: 'Accent', varName: '--color-accent' },
  { label: 'Muted', varName: '--color-muted' },
  { label: 'Text', varName: '--color-text' },
];

export const SPACING_CONTROLS = [
  { label: 'XXS — badge, tiny', varName: '--space-xxs', min: 1, max: 12 },
  { label: 'XS — gaps, icons', varName: '--space-xs', min: 2, max: 20 },
  { label: 'SM — input, nav', varName: '--space-sm', min: 4, max: 48 },
  { label: 'MD — card pad, gap', varName: '--space-md', min: 4, max: 64 },
  { label: 'LG — page, btn-lg', varName: '--space-lg', min: 8, max: 80 },
];

export const RADII_CONTROLS = [
  { label: 'Radius SM', varName: '--radius-sm', min: 0, max: 24 },
  { label: 'Radius MD', varName: '--radius-md', min: 0, max: 40 },
  { label: 'Radius LG', varName: '--radius-lg', min: 0, max: 48 },
];

export const BTN_COLOR_CONTROLS = [
  { label: 'Fill text', varName: '--btn-text-color' },
  { label: 'Gradient start', varName: '--btn-gradient-start' },
  { label: 'Gradient end', varName: '--btn-gradient-end' },
];

export const BTN_SHAPE_CONTROLS = [
  { label: 'Radius', varName: '--btn-radius', min: 0, max: 50 },
  { label: 'Padding Y', varName: '--btn-padding-y', min: 0, max: 24 },
  { label: 'Padding X', varName: '--btn-padding-x', min: 0, max: 64 },
];

export const LINK_COLOR_CONTROLS = [
  { label: 'Default (anchors)', varName: '--link-color' },
  { label: 'Hover', varName: '--link-hover' },
  { label: 'Active', varName: '--link-active' },
];

export const SHADOW_CONTROLS = [
  { label: 'Pop highlight', varName: '--pop-shadow-light' },
  { label: 'Pop shadow', varName: '--pop-shadow-dark' },
  { label: 'Active highlight', varName: '--inset-shadow-highlight' },
];

export const SUB_LABEL: React.CSSProperties = {
  fontSize: 11,
  color: 'var(--color-muted)',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: 0.8,
};
