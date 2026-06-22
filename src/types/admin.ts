export type CSSTokenMap = Record<string, string>;

export type ElevationLevel = 'low' | 'med' | 'high' | 'custom';

export interface Preset {
  name: string;
  vars: CSSTokenMap;
}

export interface ButtonVariant {
  label: string;
  cls: string;
  desc?: string;
}

export interface ButtonSize {
  label: string;
  cls: string;
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
  variant: string | null;
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
