
/** Возвращает массив без элементов содержащихся в другом массиве */
export function getArrWithoutArr<T extends { id: string }>(arr: T[], arr2: T[]): T[] {
  if (! arr || ! arr.length || ! arr2 || ! arr2.length) return arr;

  return arr.filter(item => ! arr2.some(item2 => item2.id === item.id));
}
