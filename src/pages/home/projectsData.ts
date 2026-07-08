import { independentProjectsData } from '../../data';
import type { SkillTuple } from '../../types/data';

export const skills: SkillTuple[] = Object.entries(
  independentProjectsData.reduce<Record<string, number>>((a, c) => {
    c.tools.forEach((t) => {
      a[t] = (a[t] ?? 0) + 1;
    });
    return a;
  }, {}),
).sort((a, b) => b[1] - a[1]);
