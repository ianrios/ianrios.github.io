import { CardWithDropdown } from './CardWithDropdown';
import type { DropdownOption } from '../../types/admin';

const REPORT_OPTIONS: DropdownOption[] = [
  { value: 'monthly', label: 'Monthly report' },
  { value: 'weekly', label: 'Weekly summary' },
  { value: 'annual', label: 'Annual overview' },
];

export function CardWithDropdownDemo() {
  return (
    <CardWithDropdown
      title="Report settings"
      subtitle="Select report type"
      cta="Generate"
      options={REPORT_OPTIONS}
    />
  );
}
