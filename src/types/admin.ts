export type CSSTokenMap = Record<string, string>;

export interface Preset {
  name: string;
  vars: CSSTokenMap;
}

export interface CardGridItem {
  title: string;
  desc: string;
  tools: string[];
}

export interface AccordionItem {
  id: string;
  title: string;
  body: string;
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

export interface CardColorVariant {
  label: string;
  variant: 'accent' | 'muted' | null;
  text: string;
}

export interface TimelineEvent {
  year: string;
  role: string;
  company: string;
}

export interface V2Project {
  title: string;
  desc: string;
  tools: string[];
  featured?: boolean;
}
