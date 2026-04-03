
/**
 * v.2023-05-09
 * Является value одним из массива (only simple values - extends string)
 */
export function isOneOfSeveral<T>(arr: Array<T>, value: T): boolean {
  return Boolean(arr?.find((item) => item === value));
}

/**
 * v.2023-05-09
 * Не является value одним из массива (only simple values - extends string)
 */
export function isNotOneOfSeveral<T>(arr: Array<T>, value: T): boolean {
  return Boolean(! isOneOfSeveral(arr, value));
}
