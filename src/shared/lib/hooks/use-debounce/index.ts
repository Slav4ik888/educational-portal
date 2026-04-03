import { useCallback, useRef } from 'react';


export function useDebounce(callback: (...args: unknown[]) => void, delay: number) {
  const timer = useRef(null);

  return useCallback((...args: unknown[]) => {
    if (timer.current) {
      clearTimeout(timer.current)
    }

    // @ts-ignore
    timer.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
}

//
// USE
//
// const searchUsers = useDebounce(async (value) => {
//   const res = await axios.post('https://site.ru', value);
//   setData(res.data);
// }, 500);
