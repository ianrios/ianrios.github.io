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

export type CareerPhase =
  | 'Senior Software Engineer'
  | 'Software Engineer II'
  | 'Early Career'
  | 'Research';

export interface WorkExperience {
  company: string;
  title: string;
  phase: CareerPhase;
  startYear: number;
  endYear: number | null;
  bullets: string[];
  companyUrl?: string;
}

export interface AboutData {
  bio: string;
  personal: string;
  closing: string;
  photo?: string;
}

export interface HobbyData {
  title: string;
  year: number;
  activelyMaintained: boolean;
  img_src_arr: string[];
  body: string;
  url: string;
  instagram: string;
  /** Job-title-like label distinct from `title` (the org/program name). */
  role?: string;
  /** Volunteering/mentorship entries render in their own labeled sub-group. */
  kind?: 'volunteering';
}

export interface ExternalLink {
  label: string;
  href: string;
}

export type View = 'welcome' | 'main';
export type PageId = 'work' | 'projects';
