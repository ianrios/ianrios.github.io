import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { Heading } from '../atoms/Heading';
import { Text } from '../atoms/Text';
import { Stack } from '../atoms/Stack';
import { Card } from './Card';
import { Accordion } from './Accordion';
import type { AccordionItem } from '../../types/admin';

const FAQ_ITEMS: AccordionItem[] = [
  {
    id: 'exp',
    title: 'Experience',
    body: 'Detailed work history, key accomplishments, and technologies across roles.',
  },
  {
    id: 'proj',
    title: 'Projects',
    body: 'Personal and professional projects with live demos and source links.',
  },
  {
    id: 'edu',
    title: 'Education',
    body: 'Degrees, certifications, and self-directed learning.',
  },
];

const COLOR_VARIANTS: { label: string; variant?: 'accent' | 'muted' }[] = [
  { label: 'default' },
  { label: 'accent', variant: 'accent' },
  { label: 'muted', variant: 'muted' },
];

export function CardDemo() {
  return (
    <Stack direction="col" gap="lg">
      <Stack direction="col" gap="xs">
        <Heading level={5}>Primary actions</Heading>
        <div className="skeu-preview-section">
          <Card maxWidth={320}>
            <Heading level={4} className="skeu-card-demo-heading">
              Card title
            </Heading>
            <Text className="skeu-preview-body-text">
              Surface container: pop shadows + token-aware padding and radius.
            </Text>
            <div className="skeu-preview-tags">
              <Badge>tag-one</Badge>
              <Badge>tag-two</Badge>
            </div>
            <div className="skeu-preview-actions">
              <Button variant="solid">
                <Icon name="check" /> Save
              </Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </Card>
        </div>
      </Stack>

      <Stack direction="col" gap="xs">
        <Heading level={5}>Surface actions</Heading>
        <div className="skeu-preview-section">
          <Card maxWidth={320}>
            <Heading level={4} className="skeu-card-demo-heading">
              Settings
            </Heading>
            <Text className="skeu-preview-body-text">
              Surface links blend into the card background.
            </Text>
            <div className="skeu-preview-actions">
              <a href="#demo" className="skeu-link skeu-btn--xs">
                Export
              </a>
              <a href="#demo" className="skeu-link skeu-btn--xs">
                Archive
              </a>
              <a
                href="#demo"
                className="skeu-link skeu-btn--xs skeu-card-surface-link"
              >
                <Icon name="close" size={12} /> Delete
              </a>
            </div>
          </Card>
        </div>
      </Stack>

      <Stack direction="col" gap="xs">
        <Heading level={5}>Color variants</Heading>
        <div className="skeu-preview-flex skeu-preview-section">
          {COLOR_VARIANTS.map(({ label, variant }) => (
            <Card key={label} {...(variant ? { variant } : {})}>
              <div className="skeu-card-variant-label">{label}</div>
              <div className="skeu-card-variant-title">Card title</div>
              <div className="skeu-card-variant-desc">Subtitle line</div>
              <Badge>Tag</Badge>
              <div className="skeu-card-variant-action">
                <a
                  href="#demo"
                  className="skeu-link skeu-btn--xs skeu-card-surface-link"
                >
                  Surface link
                </a>
              </div>
            </Card>
          ))}
        </div>
      </Stack>

      <Stack direction="col" gap="xs">
        <Heading level={5}>With accordion</Heading>
        <div className="skeu-preview-section">
          <Card maxWidth={380}>
            <Heading level={4} className="skeu-card-demo-heading--mb-sm">
              FAQ
            </Heading>
            <Accordion items={FAQ_ITEMS} inline />
          </Card>
        </div>
      </Stack>
    </Stack>
  );
}
