/**
 * Возвращает максимально имещющееся значение
 * @param {Array} arr
 * @param {string} field поле по которому проверка, значение должно быть number
 */
function getMaxValue<T>(arr: T[], field: string = 'id'): number {
  let maxValue = 0;
  arr.forEach(item => {
  // @ts-ignore
    if (item[field] > maxValue) maxValue = item[field];
  });
  return maxValue;
}


/**
 * 2024-02-11
 * Создаёт id следующий после максимального, если это первый элемент то 1
 */
export function createNumberId<T extends { id: number }>(
  arr   : T[], // массив для которого создаём
  field : string = 'id'    // поле хранящее значение <number>
): number {
  if (! arr) return 1;

  const maxId = getMaxValue(arr, field);
  return maxId + 1;
}
