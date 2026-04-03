
/**
 * v.2024-03-26
 * Returns true if arr is Array
 */
export function isArr<A>(arr?: A[] | unknown): boolean {
  return Array.isArray(arr);
}

export function isNotArr<A>(arr?: A[] | unknown): boolean {
  return ! isArr(arr);
}
