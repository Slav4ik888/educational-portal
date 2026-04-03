
/** Из подготовленного массива достаёт значение по индексу, если индекс больше максимального то достаёт по кругу */
export function getCircularValue<T>(array: T[], index: number): T | undefined {
  if (! array || ! array.length) return;

  const circularIndex = index % array.length;
  // Обработка отрицательных индексов
  const adjustedIndex = circularIndex >= 0 ? circularIndex : array.length + circularIndex;

  /* eslint-disable */
  return array[adjustedIndex];
}

// // Пример использования:
// const arr = ['a', 'b', 'c', 'd', 'e'];

// console.log(getCircularValue(arr, 0));  // 'a'
// console.log(getCircularValue(arr, 2));  // 'c'
// console.log(getCircularValue(arr, 5));  // 'a' (6-й элемент по кругу)
// console.log(getCircularValue(arr, 7));  // 'c' (8-й элемент по кругу)
// console.log(getCircularValue(arr, -1)); // 'e' (последний элемент)
// console.log(getCircularValue(arr, -3)); // 'c' (3-й элемент с конца)
