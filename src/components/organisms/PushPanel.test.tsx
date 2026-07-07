import { describe, it, expect, vi } from 'vitest';
import { StrictMode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PushPanel } from './PushPanel';

describe('PushPanel', () => {
  it('fires onOpenChange exactly once per toggle, even in StrictMode', async () => {
    const onOpenChange = vi.fn();
    render(
      <StrictMode>
        <PushPanel label="design" onOpenChange={onOpenChange}>
          <div>body</div>
        </PushPanel>
      </StrictMode>,
    );
    const tab = screen.getByRole('button', { name: 'Open design panel' });
    await userEvent.click(tab);
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    await userEvent.click(
      screen.getByRole('button', { name: 'Close design panel' }),
    );
    expect(onOpenChange).toHaveBeenCalledTimes(2);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });
});
