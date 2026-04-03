
export type ArrWithId = Array<{ id: string }>
/**
 * @returns отсортированный массив arr также как в ids отсортированы id-шники
 * Лишнее, не входящее в ids не возвращаются
 */
export function sortingArrByIds<A extends ArrWithId>(
  arr : A,
  ids : string[]
): A {
  if (! ids || ! arr) return [] as unknown as A

  return ids
    .map(id => arr.find(it => it.id === id))
    .filter(item => item) as A;
}
