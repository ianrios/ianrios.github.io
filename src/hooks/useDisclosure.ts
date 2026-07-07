import { useState } from 'react';

// Shared accordion-group state: which item ids are open. autoClose keeps at
// most one open (classic accordion); false allows independent sections.
// Single yes/no disclosures should stay plain useState booleans.
export function useDisclosureGroup({
  autoClose = true,
  defaultOpen = [],
}: {
  autoClose?: boolean;
  defaultOpen?: string[];
} = {}) {
  const [open, setOpen] = useState<ReadonlySet<string>>(
    () => new Set(defaultOpen),
  );

  const isOpen = (id: string): boolean => open.has(id);

  const toggle = (id: string) => {
    setOpen((prev) => {
      if (prev.has(id)) {
        const next = new Set(prev);
        next.delete(id);
        return next;
      }
      return autoClose ? new Set([id]) : new Set(prev).add(id);
    });
  };

  return { isOpen, toggle };
}
