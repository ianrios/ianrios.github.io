import { Icon, type IconName } from './Icon';

const ICON_SAMPLES: IconName[] = [
  'send',
  'github',
  'info',
  'external',
  'plus',
  'close',
];

export function IconDemo() {
  return (
    <>
      {ICON_SAMPLES.map((name) => (
        <span key={name} className="skeu-preview-icon-cell" title={name}>
          <Icon name={name} size={20} />
        </span>
      ))}
      <span className="skeu-preview-note">
        named SVGs render inline; others fall back to a Unicode glyph.
      </span>
    </>
  );
}
