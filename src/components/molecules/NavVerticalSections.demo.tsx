import { Heading } from '../atoms/Heading';
import { Stack } from '../atoms/Stack';
import { NavVerticalSections } from './NavVerticalSections';
import type { NavSection } from '../../types/admin';

const SECTIONS: NavSection[] = [
  {
    id: 'experience',
    label: 'Experience',
    items: [
      { id: 'built', label: 'Built Technologies' },
      { id: 'prev', label: 'Previous Co' },
    ],
  },
  {
    id: 'projects',
    label: 'Projects',
    items: [
      { id: 'speclab', label: 'SpecLab' },
      { id: 'bafconx', label: 'BAFConX' },
    ],
  },
  {
    id: 'hobbies',
    label: 'Hobbies',
    items: [
      { id: 'music', label: 'Music' },
      { id: '3d', label: '3D / WebGL' },
    ],
  },
];

export function NavVerticalSectionsDemo() {
  return (
    <Stack direction="col" gap="lg">
      <Stack direction="col" gap="xs">
        <Heading level={5}>Button variant</Heading>
        <div className="skeu-preview-section--sm">
          <NavVerticalSections sections={SECTIONS} />
        </div>
      </Stack>

      <Stack direction="col" gap="xs">
        <Heading level={5}>Link variant</Heading>
        <div className="skeu-preview-section">
          <NavVerticalSections sections={SECTIONS} variant="links" />
        </div>
      </Stack>
    </Stack>
  );
}
