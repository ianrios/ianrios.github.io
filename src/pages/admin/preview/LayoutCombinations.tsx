import { Badge } from '../../../components/atoms/Badge';
import { Button } from '../../../components/atoms/Button';
import { Icon, type IconName } from '../../../components/atoms/Icon';
import { Card } from '../../../components/molecules/Card';
import { Heading } from '../../../components/atoms/Heading';
import { Text } from '../../../components/atoms/Text';
import { SectionLabel } from '../AdminUI';
export function LayoutCombinations() {
  return (
    <>
      <SectionLabel>Settings panel: Card → nested item rows</SectionLabel>
      <div className="skeu-combo-section">
        <Card maxWidth={360}>
          <Heading level={4} className="skeu-combo-card-heading--sm">
            Preferences
          </Heading>
          {(
            [
              { icon: 'edit', label: 'Display name', value: 'Ian Rios' },
              { icon: 'link', label: 'Public URL', value: 'ianrios.me' },
              { icon: 'star', label: 'Featured project', value: 'SpecLab' },
            ] satisfies { icon: IconName; label: string; value: string }[]
          ).map(({ icon, label, value }) => (
            <div key={label} className="skeu-combo-settings__row">
              <div className="skeu-combo-settings__label">
                <Icon name={icon} size={13} />
                <span className="skeu-combo-settings__label-text">{label}</span>
              </div>
              <div className="skeu-combo-settings__actions">
                <span className="skeu-combo-settings__value">{value}</span>
                <Button variant="outline" size="xs">
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </Card>
      </div>

      <SectionLabel>
        Inset panel with link actions: Card + Button (as link)
      </SectionLabel>
      <div className="skeu-combo-section">
        <Card maxWidth={420}>
          <Heading level={4} className="skeu-combo-card-heading--sm">
            Open source
          </Heading>
          <div className="skeu-combo-inset">
            <div className="skeu-combo-inset__tags">
              <Badge>React</Badge>
              <Badge>Three.js</Badge>
              <Badge>WebGL</Badge>
            </div>
            <div className="skeu-combo-inset__desc">
              A public project living in the repo.
            </div>
          </div>
          <div className="skeu-combo-inset__footer">
            <Button
              as="link"
              href="https://ianrios.me"
              external
              size="xs"
              variant="surface"
            >
              Visit site
            </Button>
            <div className="skeu-combo-inset__icons">
              <Button
                as="link"
                icon="github"
                href="https://github.com/ianrios"
                aria-label="GitHub repo"
                variant="ghost"
              />
              <Button
                as="link"
                icon="external"
                href="https://ianrios.me"
                aria-label="Open in new tab"
                variant="ghost"
              />
            </div>
          </div>
        </Card>
      </div>

      <SectionLabel>Modal: Card floating over dimmed Page</SectionLabel>
      <div className="skeu-preview-page-frame skeu-combo-modal-stage">
        <div className="skeu-combo-page-label">Page</div>
        <div className="skeu-combo-modal-bg">
          <div className="skeu-combo-modal-bg__col">
            <Card padding="sm">
              <div className="skeu-combo-settings__value">
                Background content
              </div>
            </Card>
          </div>
          <div className="skeu-combo-modal-bg__col">
            <Card padding="sm">
              <div className="skeu-combo-settings__value">
                Background content
              </div>
            </Card>
          </div>
        </div>
        <div className="skeu-combo-modal-overlay">
          <div className="skeu-combo-modal-dialog">
            <Card>
              <Heading level={4} className="skeu-combo-card-heading--sm">
                Confirm delete
              </Heading>
              <Text className="skeu-combo-modal-para">
                This action cannot be undone.
              </Text>
              <div className="skeu-combo-modal-actions">
                <Button variant="outline" size="xs">
                  Cancel
                </Button>
                <Button variant="solid" size="xs">
                  Delete
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
