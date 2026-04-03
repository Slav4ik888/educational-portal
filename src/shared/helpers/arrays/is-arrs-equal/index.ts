import { isArr, isObj } from 'shared/lib/validators';


/** Returns true if arr1 == arr2 */
export function isArrsEqual(arr1: any[], arr2: any[]): boolean {
  if (!isArr(arr1) || !isArr(arr2)) return false;
  if (arr1.length !== arr2.length) return false;

  return arr1.every((item, idx) => {
    if (isObj(item)) return JSON.stringify(item) === JSON.stringify(arr2[idx])
    if (isArr(item)) return isArrsEqual(item, arr2[idx])
    return item === arr2[idx]
  })
}
