import { TierLabel } from '../AdminUI';
import { BasicCombinations } from './BasicCombinations';
import { LayoutCombinations } from './LayoutCombinations';
import { OrgCombinations } from './OrgCombinations';
import '../preview.scss';

export function CombinationsSection() {
  return (
    <>
      <TierLabel>Combinations</TierLabel>
      <div className="preview-note" style={{ marginBottom: 'var(--space-md)' }}>
        Real compositions — Page wraps content with color-bg + space-lg. Cards
        are surfaces inside it.
      </div>
      <BasicCombinations />
      <LayoutCombinations />
      <OrgCombinations />
    </>
  );
}
