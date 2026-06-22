import type React from 'react';

export const hoverStyle: React.CSSProperties = {
  transform: 'translateY(1px) scale(0.997)',
  filter: 'brightness(0.997)',
  boxShadow:
    'var(--pop-shadow-light), var(--pop-shadow-dark), var(--btn-elevation)',
};

export const activeStyle: React.CSSProperties = {
  transform: 'translateY(4px) scale(0.995)',
  boxShadow:
    'inset var(--inset-shadow-light, 6px 6px 10px rgba(0,0,0,0.04)), inset var(--inset-shadow-highlight, -4px -4px 8px rgba(255,255,255,0.85))',
};

export const LINK_STYLES = [
  { label: 'surface', variantClass: '', desc: 'default surface/button' },
  {
    label: 'surface + underline',
    variantClass: 'skeu-link--underline',
    desc: 'surface + forced underline',
  },
  {
    label: 'text',
    variantClass: 'skeu-link--text',
    desc: 'plain underlined text',
  },
  {
    label: 'ghost',
    variantClass: 'skeu-link--ghost',
    desc: 'color only, no decoration',
  },
];

export const LINK_COLORS = [
  { label: 'default', colorClass: '' },
  { label: 'muted', colorClass: 'skeu-link--muted' },
  { label: 'accent', colorClass: 'skeu-link--accent' },
  { label: 'primary', colorClass: 'skeu-link--primary' },
];
