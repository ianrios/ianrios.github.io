export interface ProjectData {
  title: string;
  year: number;
  activelyMaintained: boolean;
  body: string;
  href: string;
  live: string;
  tools: string[];
  img_src_arr?: string[];
  /** Optional background-reading link rendered as an info icon on the card. */
  info?: string;
}

export interface WorkExperience {
  title: string;
  year: number;
  tools: string[];
  activelyMaintained: boolean;
  company: string;
  img_src_arr?: string[];
  body: string;
  href: string;
  live: string;
}

export interface HobbyData {
  title: string;
  year: number;
  activelyMaintained: boolean;
  img_src_arr: string[];
  body: string;
  url: string;
  instagram: string;
}

/** Any card renderable in the portfolio masonry grid. */
export type PortfolioItem = ProjectData | WorkExperience | HobbyData;

export interface ExternalLink {
  label: string;
  href: string;
}

export type SkillTuple = [string, number];

export type ToolsMap = Record<string, string>;

export type View = 'welcome' | 'main';
export type PageId = 'work' | 'projects' | 'hobbies';
