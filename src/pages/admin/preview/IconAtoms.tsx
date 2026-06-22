import { Icon } from '../../../components/atoms/Icon';
import { ICON_MAP } from '../../../components/atoms/icon-map';
import { IconButton } from '../../../components/atoms/IconButton';
import { IconLink } from '../../../components/atoms/IconLink';
import { SectionLabel } from '../AdminUI';
import '../preview.scss';

const SVG_ICONS = [
  'github',
  'instagram',
  'info',
  'external',
  'send',
  'chevron-down',
  'chevron-up',
  'menu',
  'close',
];

function IconEntry({ name, size = 18 }: { name: string; size?: number }) {
  return (
    <div className="preview-icon-entry">
      <Icon name={name} size={size} />
      <span className="preview-icon-label">{name}</span>
    </div>
  );
}

export function IconAtoms() {
  return (
    <>
      <SectionLabel>Icon — Unicode (inline / decorative)</SectionLabel>
      <div
        className="preview-flex preview-flex--end"
        style={{ marginBottom: 'var(--space-sm)' }}
      >
        {Object.entries(ICON_MAP).map(([name]) => (
          <IconEntry key={name} name={name} />
        ))}
      </div>

      <SectionLabel>Icon — SVG repo icons</SectionLabel>
      <div
        className="preview-flex preview-flex--end"
        style={{ marginBottom: 'var(--space-md)' }}
      >
        {SVG_ICONS.map((name) => (
          <IconEntry key={name} name={name} />
        ))}
      </div>

      <SectionLabel>IconButton — square icon-only button</SectionLabel>
      <div className="preview-flex" style={{ marginBottom: 'var(--space-md)' }}>
        <IconButton name="close" aria-label="Close" />
        <IconButton name="edit" aria-label="Edit" />
        <IconButton name="plus" variant="primary" aria-label="Add" />
        <IconButton name="send" aria-label="Send" />
        <IconButton name="menu" aria-label="Menu" />
      </div>

      <SectionLabel>IconLink — square icon-only anchor</SectionLabel>
      <div className="preview-flex" style={{ marginBottom: 'var(--space-md)' }}>
        <IconLink
          name="github"
          href="https://github.com/ianrios"
          aria-label="GitHub"
        />
        <IconLink
          name="instagram"
          href="https://www.instagram.com/ian___rios"
          aria-label="Instagram"
        />
        <IconLink
          name="external"
          href="https://ianrios.me"
          aria-label="Open site"
        />
        <IconLink name="info" href="#demo" aria-label="Info" />
      </div>
    </>
  );
}
