/**
 * v.2025-05-20
 * При некорректных значениях вернёт  0
 */
export function toNumber(value: unknown, defaultValue: number = 0): number {
  // Обработка специальных значений
  if (value === null || value === undefined || (typeof value === 'number' && isNaN(value))) {
    return defaultValue;
  }
  if (value === true || value === false) {
    return defaultValue;
  }

  // Если value уже число
  if (typeof value === 'number') {
    return value;
  }

  // Обработка строк
  if (typeof value === 'string') {
    // Удаляем все пробелы и нечисловые символы (кроме минуса, точек и запятых)
    let cleaned = value.replace(/[^\d.,-]/g, '');


    // Нормализуем число
    cleaned = cleaned.replace(/,/g, '.');    // Заменяем десятичный разделитель на точку

    // Удаляем лишние минусы и точки
    cleaned = cleaned
      .replace(/(?!^)-/g, '')
      .replace(/(\..*)\./g, '$1');

    if (! cleaned && cleaned !== '0') return defaultValue;

    const num = Number(cleaned);
    return isNaN(num) ? defaultValue : num;
  }

  return defaultValue;
}


// Примеры работы:
// console.log(toNumber("12,456"));     // 12.456
// console.log(toNumber("1 234.5"));    // 1234.5
// console.log(toNumber("abc"));        // 0 (defaultValue)
// console.log(toNumber(null));         // 0
// console.log(toNumber(undefined));    // 0
// console.log(toNumber(NaN));          // 0
// console.log(toNumber(true));         // 0 (раньше было 1, теперь defaultValue)
// console.log(toNumber(false));        // 0
// console.log(toNumber({}));           // 0
// console.log(toNumber([1, 2]));       // 0
// console.log(toNumber("12.34.56"));   // 0 (лишние точки удаляются, но формат невалиден)
