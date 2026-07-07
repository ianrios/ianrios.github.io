import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DesignVarsProvider } from './DesignVarsProvider';
import { useDesignVars } from './designVarsContext';
import { STORAGE_KEY } from '../pages/admin/designStorage';
import { DEFAULT_THEME } from '../pages/admin/adminData';
import type { StoredDesign } from '../types/admin';

function Probe() {
  const { vars, setVar, activeTheme, applyTheme, resetAll } = useDesignVars();
  return (
    <div>
      <div data-testid="theme">{activeTheme ?? 'none'}</div>
      <div data-testid="bg">{vars['--color-bg']}</div>
      <div data-testid="ghost">{vars['--btn-gradient-end'] ?? 'absent'}</div>
      <button
        onClick={() => {
          setVar('--color-bg', '#123456');
        }}
      >
        edit
      </button>
      <button
        onClick={() => {
          applyTheme('Glow');
        }}
      >
        glow
      </button>
      <button onClick={resetAll}>reset</button>
    </div>
  );
}

const renderProbe = () =>
  render(
    <DesignVarsProvider>
      <Probe />
    </DesignVarsProvider>,
  );

const stored = (): StoredDesign | null => {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as StoredDesign) : null;
};

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.removeAttribute('style');
});

describe('DesignVarsProvider', () => {
  it('fresh visit: default theme active, nothing persisted', () => {
    renderProbe();
    expect(screen.getByTestId('theme')).toHaveTextContent(DEFAULT_THEME);
    expect(stored()).toBeNull();
    expect(
      document.documentElement.style.getPropertyValue('--color-bg'),
    ).toBe('#000000');
  });

  it('editing a token persists theme + override diff only', async () => {
    renderProbe();
    await userEvent.click(screen.getByRole('button', { name: 'edit' }));
    const s = stored();
    expect(s?.theme).toBe(DEFAULT_THEME);
    expect(s?.overrides).toEqual({ '--color-bg': '#123456' });
    expect(s?.snapshot['--color-bg']).toBe('#123456');
  });

  it('applying a theme drops overrides and re-derives bevel tones', async () => {
    renderProbe();
    await userEvent.click(screen.getByRole('button', { name: 'edit' }));
    await userEvent.click(screen.getByRole('button', { name: 'glow' }));
    const s = stored();
    expect(s?.theme).toBe('Glow');
    expect(s?.overrides).toEqual({});
    expect(screen.getByTestId('bg')).toHaveTextContent('#0a0014');
  });

  it('stale stored keys never reach :root or re-persist', async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        theme: 'Glow',
        overrides: { '--btn-gradient-end': '#ff0000' },
        snapshot: {},
      } satisfies StoredDesign),
    );
    renderProbe();
    expect(screen.getByTestId('ghost')).toHaveTextContent('absent');
    await userEvent.click(screen.getByRole('button', { name: 'edit' }));
    expect(stored()?.overrides).toEqual({ '--color-bg': '#123456' });
  });

  it('reset clears storage and returns to the default theme', async () => {
    renderProbe();
    await userEvent.click(screen.getByRole('button', { name: 'edit' }));
    await userEvent.click(screen.getByRole('button', { name: 'reset' }));
    expect(stored()).toBeNull();
    expect(screen.getByTestId('theme')).toHaveTextContent(DEFAULT_THEME);
    expect(screen.getByTestId('bg')).toHaveTextContent('#000000');
  });
});
