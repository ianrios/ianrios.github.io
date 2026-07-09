import { SectionLabel, TierLabel } from '../AdminUI';
import { FormFieldDemo } from '../../../components/molecules/FormField.demo';
import { CardDemo } from '../../../components/molecules/Card.demo';
import { CardWithDropdownDemo } from '../../../components/molecules/CardWithDropdown.demo';
import { NavBarDemo } from '../../../components/molecules/NavBar.demo';
import { NavVerticalDemo } from '../../../components/molecules/NavVertical.demo';
import { NavVerticalSectionsDemo } from '../../../components/molecules/NavVerticalSections.demo';
import { AccordionDemo } from '../../../components/molecules/Accordion.demo';
import { BulletListDemo } from '../../../components/molecules/BulletList.demo';
import { ScrollAreaDemo } from '../../../components/molecules/ScrollArea.demo';

export function MoleculesSection() {
  return (
    <>
      <TierLabel>Molecules</TierLabel>

      <SectionLabel>Form field</SectionLabel>
      <FormFieldDemo />

      <SectionLabel>Card</SectionLabel>
      <CardDemo />

      <SectionLabel>Card with dropdown</SectionLabel>
      <CardWithDropdownDemo />

      <SectionLabel>Nav: horizontal</SectionLabel>
      <NavBarDemo />

      <SectionLabel>Nav: vertical</SectionLabel>
      <NavVerticalDemo />

      <SectionLabel>Nav: vertical sections</SectionLabel>
      <NavVerticalSectionsDemo />

      <SectionLabel>Accordion</SectionLabel>
      <AccordionDemo />

      <SectionLabel>Bullet list (resume achievements)</SectionLabel>
      <BulletListDemo />

      <SectionLabel>ScrollArea</SectionLabel>
      <ScrollAreaDemo />
    </>
  );
}
