export const ICON_MAP = {
  arrow: '→',
  plus: '+',
  check: '✓',
  close: '×',
  menu: '☰',
  chevron: '›',
  edit: '✏',
  star: '★',
  folder: '◉',
  'circle-fill': '●',
  circle: '○',
  link: '⌁',
} as const satisfies Record<string, string>;

export type TextIconName = keyof typeof ICON_MAP;
