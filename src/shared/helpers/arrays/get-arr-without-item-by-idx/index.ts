import { __devLog } from 'shared/lib/tests/__dev-log';

/**
 * Возвращает массив без указанного элемента по index
 */
export function getArrWithoutItemByIndex<T>(
  items  : T[] | undefined,
  index  : number,
): T[] {
  // Проверяем, что массив существует и является массивом
  if (!Array.isArray(items)) {
    __devLog('getArrWithoutItemByIndex', 'Первый аргумент не является массивом');
    return items as unknown as T[]; // или можно вернуть undefined или бросить ошибку
  }

  // Проверяем, что индекс является числом и находится в допустимых пределах
  if (typeof index !== 'number' || !Number.isInteger(index) || index < 0 || index >= items.length) {
    __devLog('getArrWithoutItemByIndex', 'Неверный индекс');
    return items.slice(); // Возвращаем копию исходного массива
  }

  // Создаем новый массив без элемента с указанным индексом
  return [...items.slice(0, index), ...items.slice(index + 1)];
}
