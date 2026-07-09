import { useCallback, useSyncExternalStore } from 'react';

/** Reactive matchMedia: re-renders when the query starts/stops matching. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onStoreChange);
      return () => {
        mql.removeEventListener('change', onStoreChange);
      };
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
  );
}
