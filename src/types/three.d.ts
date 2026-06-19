declare module 'react-three-paper' {
  import type React from 'react';
  export function Paper(props: {
    script: (...args: unknown[]) => unknown;
  }): React.ReactElement | null;
}
