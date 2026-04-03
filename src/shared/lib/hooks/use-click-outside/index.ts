import { useEffect, MouseEvent } from 'react';

// Improved version of https://usehooks.com/useOnClickOutside/
export const useClickOutside = (
  ref: React.MutableRefObject<undefined>,
  handler: (event: MouseEvent | TouchEvent) => void
) => {
  useEffect(() => {
    let startedInside = false;
    let startedWhenMounted = false;

    const listener = (event: any) => {
      // Do nothing if `mousedown` or `touchstart` started inside ref element
      if (startedInside || !startedWhenMounted) return;
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || (ref.current as HTMLElement).contains(event.target)) return;

      handler(event);
    };

    const validateEventStart = (event: any) => {
      startedWhenMounted = Boolean(ref.current);
      startedInside = Boolean(ref.current && (ref.current as HTMLElement).contains(event.target));
    };

    document.addEventListener('mousedown', validateEventStart);
    document.addEventListener('touchstart', validateEventStart);
    document.addEventListener('click', listener);

    return () => {
      document.removeEventListener('mousedown', validateEventStart);
      document.removeEventListener('touchstart', validateEventStart);
      document.removeEventListener('click', listener);
    };
  }, [ref, handler]);
};
