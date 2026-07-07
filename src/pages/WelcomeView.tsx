import { lazy, Suspense, useState } from 'react';
import { Text } from '../components/atoms/Text';
import type { View } from '../types/data';

// Lazy so three.js stays out of the entry chunk; the canvas fades in when the
// chunk lands (same chunk the /three route uses).
const ThreeScene = lazy(() => import('../three/ThreeScene'));

const colors = [
  'FF6B35', // coral orange
  'D30C7B', // magenta
  '57E2E5', // cyan
  'FF1744', // bright red
  'C6FF00', // electric lime
  'FF9100', // amber
  'EFCA08', // yellow
  'E040FB', // bright violet
  'D11149', // crimson
  'FF4081', // hot pink
  '97CC04', // lime green
  '31E981', // green
  '00B0FF', // sky blue
  '2EC4B6', // teal
  '6320EE', // deep violet
  '00D9C0', // aqua
];

function pickColor(): string {
  let recent: string[] = [];
  try {
    const raw = localStorage.getItem('splash_recent');
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        recent = parsed.filter((c): c is string => typeof c === 'string');
      }
    }
  } catch {
    recent = [];
  }

  if (recent.length >= 3) recent.pop();

  const available = colors.filter((c) => !recent.includes(c));
  const pool = available.length > 0 ? available : colors;
  const picked =
    pool[Math.floor(Math.random() * pool.length)] ?? colors[0] ?? '';

  recent.unshift(picked);
  try {
    localStorage.setItem('splash_recent', JSON.stringify(recent));
  } catch {
    // localStorage unavailable (private mode, etc.) — silently continue
  }

  return picked;
}

export function WelcomeView({ setView }: { setView: (v: View) => void }) {
  const [color] = useState(pickColor);
  return (
    <div className="view-1">
      <Suspense fallback={null}>
        <ThreeScene />
      </Suspense>
      <button
        className="name montserrat special-p"
        style={{ '--splash-color': `#${color}` }}
        onClick={() => {
          setView('main');
        }}
      >
        Ian Rios
      </button>
      <Text className="special-b">
        <button
          className="splash-enter"
          onClick={() => {
            setView('main');
          }}
        >
          enter
        </button>
      </Text>
    </div>
  );
}
