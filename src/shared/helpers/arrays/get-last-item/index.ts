
/**
 * Возвращает последний элемент массива (или со сдвигом)
 * @param data массив
 * @param shift смещение в обратную сторону 1 это предпоследний элемент (2й с конца), 2 это пред-предпоследний (3й с конца)
 */
export function getLastItem<T>(data: T[] | undefined, shift: number = 0): T | undefined {
  if (! data || ! data?.length) return undefined

  return shift ? data[data.length - 1 - shift] : data[data.length - 1]
}
