/**
 * Возвращает ключ объекта по значению value
 */
export function getKeyByValue<O extends object, S>(obj: O, value: S): string {
  if (typeof obj !== 'object') {
    // console.log(`obj - не является объектом. ${obj}`);
    return '';
  }

  const entries = Object.entries(obj);
  if (!entries.length) {
    // console.log(`obj - пустой. ${obj}`);
    return '';
  }

  const idx = entries.findIndex(item => item[1] === value);
  if (idx === -1) {
    // console.log(`${value} отсутствует в ${obj}`);
    return '';
  }

  return entries[idx][0];
}
