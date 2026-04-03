/**
 * Возвращает true если item находится в arr
 */
export function isItemInArr<T extends number | string>(arr: Array<T>, item: T): boolean {
  if (!arr?.length) return false;

  return Boolean(arr.find(it => it === item))
}
