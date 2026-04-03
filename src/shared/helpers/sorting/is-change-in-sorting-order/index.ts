/**
 * v.2023-09-17
 * Возвращает было ли изменение в сортировке массивов
 */
export function isChangeInSortingOrder<T extends object & {[k: string]: unknown}>(
  lastSort : Array<T>,
  newSort  : Array<T>,
  field    : string
): boolean {
  return Boolean(lastSort.find((lastItem, i) => lastItem?.[field] !== newSort?.[i]?.[field]));
}
