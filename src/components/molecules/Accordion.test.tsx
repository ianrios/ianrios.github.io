import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion } from './Accordion';
import type { AccordionItem } from '../../types/admin';

const ITEMS: AccordionItem[] = [
  { id: 'a', title: 'First', body: 'first body' },
  { id: 'b', title: 'Second', body: 'second body' },
];

const trigger = (name: string) =>
  screen.getByRole('button', { name: new RegExp(name) });

describe('Accordion', () => {
  it('starts fully closed by default', () => {
    render(<Accordion items={ITEMS} />);
    expect(trigger('First')).toHaveAttribute('aria-expanded', 'false');
    expect(trigger('Second')).toHaveAttribute('aria-expanded', 'false');
  });

  it('autoClose (default) keeps at most one section open', async () => {
    render(<Accordion items={ITEMS} />);
    await userEvent.click(trigger('First'));
    expect(trigger('First')).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(trigger('Second'));
    expect(trigger('First')).toHaveAttribute('aria-expanded', 'false');
    expect(trigger('Second')).toHaveAttribute('aria-expanded', 'true');
  });

  it('autoClose={false} allows multiple open sections', async () => {
    render(<Accordion items={ITEMS} autoClose={false} />);
    await userEvent.click(trigger('First'));
    await userEvent.click(trigger('Second'));
    expect(trigger('First')).toHaveAttribute('aria-expanded', 'true');
    expect(trigger('Second')).toHaveAttribute('aria-expanded', 'true');
  });

  it('defaultOpen opens the listed ids', () => {
    render(<Accordion items={ITEMS} defaultOpen={['b']} />);
    expect(trigger('First')).toHaveAttribute('aria-expanded', 'false');
    expect(trigger('Second')).toHaveAttribute('aria-expanded', 'true');
  });

  it('clicking an open section closes it', async () => {
    render(<Accordion items={ITEMS} defaultOpen={['a']} />);
    await userEvent.click(trigger('First'));
    expect(trigger('First')).toHaveAttribute('aria-expanded', 'false');
  });
});
