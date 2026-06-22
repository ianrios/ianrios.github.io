export interface ProjectData {
  title: string;
  year: number;
  activelyMaintained: boolean;
  body: string;
  href: string;
  live: string;
  tools: string[];
  img_src_arr?: string[];
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

export type SkillTuple = [string, number];

export type ToolsMap = Record<string, string>;
