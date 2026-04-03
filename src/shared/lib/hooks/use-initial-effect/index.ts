import { useEffect } from 'react';

/**
 * If Storybook => enter callback
 */
export const useInitialEffect = (callback: () => void) => {
  useEffect(() => {
    if (__PROJECT__ !== 'storybook') {
      callback()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
