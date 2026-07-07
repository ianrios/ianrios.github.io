import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Button } from './Button';

describe('Button (button arm)', () => {
  it('renders a real <button> and fires onClick', async () => {
    const onClick = vi.fn();
    render(<Button text="Save" onClick={onClick} />);
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('disabled button does not fire onClick', async () => {
    const onClick = vi.fn();
    render(<Button text="Save" disabled onClick={onClick} />);
    const btn = screen.getByRole('button', { name: 'Save' });
    expect(btn).toBeDisabled();
    await userEvent.click(btn).catch(() => undefined);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('icon-only exposes its aria-label as the accessible name', () => {
    render(<Button icon="send" aria-label="Send message" />);
    expect(
      screen.getByRole('button', { name: 'Send message' }),
    ).toBeInTheDocument();
  });
});

describe('Button (link arm)', () => {
  it('internal href renders a router link', () => {
    render(
      <MemoryRouter>
        <Button as="link" href="/design-system" text="Design" />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Design' })).toHaveAttribute(
      'href',
      '/design-system',
    );
  });

  it('external href renders a hardened anchor', () => {
    render(<Button as="link" href="https://example.com" text="Out" />);
    const a = screen.getByRole('link', { name: 'Out' });
    expect(a).toHaveAttribute('target', '_blank');
    expect(a).toHaveAttribute('rel', 'noreferrer');
  });

  it('disabled link renders an inert non-link', () => {
    render(<Button as="link" href="/x" disabled text="Gone" />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('Gone')).toHaveAttribute('aria-disabled', 'true');
  });
});
