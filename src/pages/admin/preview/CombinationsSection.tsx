import { TierLabel } from '../AdminUI';
import { BasicCombinations } from './BasicCombinations';
import { LayoutCombinations } from './LayoutCombinations';
import { OrgCombinations } from './OrgCombinations';
export function CombinationsSection() {
  return (
    <>
      <TierLabel>Patterns</TierLabel>
      <div className="skeu-preview-note skeu-preview-section">
        Real compositions: Page wraps content with color-bg + space-lg. Cards
        are surfaces inside it. Groups are separated by a space-xl section gap.
      </div>
      <div className="skeu-combo-tiers">
        <div>
          <BasicCombinations />
        </div>
        <div>
          <LayoutCombinations />
        </div>
        <div>
          <OrgCombinations />
        </div>
      </div>
    </>
  );
}
