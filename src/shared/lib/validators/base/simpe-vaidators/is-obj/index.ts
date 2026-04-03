import { isArr } from '../is-arr';

/** True if "o" is object & not Array */
export function isObj<O>(o: O): boolean {
  return o !== null
    && typeof o === 'object'
    && !isArr(o as unknown as unknown[]);
}

export function isNotObj<O>(o: O): boolean {
  return ! isObj(o)
}
