import { useState } from 'react';

// Props shared by the horizontal (NavBar) and vertical (NavVertical) navs —
// same API, different layout.
export interface NavProps {
  pages?: string[];
  ctaLabel?: string;
  siteName?: string;
  variant?: 'buttons' | 'links';
  active?: string;
  onNavigate?: (page: string) => void;
}

// Controlled/uncontrolled active-page state shared by both navs.
export function useActiveNav(
  pages: string[],
  controlledActive?: string,
  onNavigate?: (page: string) => void,
) {
  const [localActive, setLocalActive] = useState<string | undefined>(
    controlledActive ?? pages[0],
  );
  const active = controlledActive ?? localActive;

  const handleClick = (page: string) => {
    setLocalActive(page);
    onNavigate?.(page);
  };

  return { active, handleClick };
}
