
/** Совмещает массивы по id элементов */
export function mergeById<T extends { id: string }>(array1: T[], array2: T[]): T[] {
  const map = new Map<string, T>();

  // Добавляем все элементы из первого массива
  if (array1 && array1.length) {
    array1.forEach(item => map.set(item.id, item));
  }

  // Обновляем/добавляем элементы из второго массива
  if (array2 && array2.length) {
    array2.forEach(item => {
      map.set(item.id, { ...map.get(item.id) || {}, ...item });
    });
  }

  return Array.from(map.values());
}
