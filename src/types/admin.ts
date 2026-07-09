import type { ReactNode } from 'react';

export type CSSTokenMap = Record<string, string>;

export interface Preset {
  name: string;
  vars: CSSTokenMap;
}

// localStorage design:v1 payload. theme + overrides are the semantic state;
// snapshot is the resolved var map the index.html flash script replays.
export interface StoredDesign {
  version: 1;
  theme: string | null;
  overrides: CSSTokenMap;
  snapshot: CSSTokenMap;
}

export interface DropdownOption {
  value: string;
  label: string;
}

export interface CardGridItem {
  title: string;
  desc: string;
  tools: string[];
}

export interface AccordionItem {
  id: string;
  title: string;
  /** Rich content allowed so a section can hold cards, lists, etc. */
  body: ReactNode;
}

interface NavSectionItem {
  id: string;
  label: string;
}

export interface NavSection {
  id: string;
  label: string;
  items: NavSectionItem[];
}
