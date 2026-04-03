import { useEffect } from 'react';


export function useKeyPress(callback: (code: string) => void, keyCodes: string[]): void {
  const handler = ({ code }: KeyboardEvent) => {
    // console.log('code: ', code);
    if (keyCodes.includes(code)) {
      callback(code);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
