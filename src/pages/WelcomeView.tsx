import { useState } from 'react';
import MetaBalls from '../MetaBalls';

const colors = [
  '74A57F',
  'D30C7B',
  '57E2E5',
  'A50104',
  'EBF8B8',
  '7FB069',
  'EFCA08',
  'A14DA0',
  'D11149',
  'A9FFF7',
  '97CC04',
  '31E981',
  'F0C808',
  '2EC4B6',
  '6320EE',
  '00D9C0',
];

export function WelcomeView({ setView }: { setView: (v: string) => void }) {
  const [color] = useState(
    () => colors[(colors.length * Math.random()) | 0] ?? colors[0] ?? '',
  );
  return (
    <div className="view-1">
      <MetaBalls />
      <span
        className={`name montserrat special-p color-${color}`}
        style={{ cursor: 'pointer', display: 'block' }}
        role="button"
        tabIndex={0}
        onClick={() => {
          setView('main');
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') setView('main');
        }}
      >
        Ian Rios
      </span>
      <p className="special-b" style={{ textAlign: 'center' }}>
        <button
          className="open-link montserrat"
          onClick={() => {
            setView('main');
          }}
        >
          enter
        </button>
      </p>
    </div>
  );
}
