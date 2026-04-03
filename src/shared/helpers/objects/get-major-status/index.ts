/* eslint-disable */
import type { Item } from '../../arrays';

/**
 * Возвращает номер позиции элемента в объекте
 */
export const getValuePosition = (obj: Item, value: unknown): number => {
  let possition = 0;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      ++possition;

      if (value === obj[key]) return possition;
    }
  }
  return 0;
};


/**
 * v.2023-07-15
 * Проверяем есть ли уже более значимый статус
 * Возвращает статус стоящий дальше по списку (имеющий больший индекс)
 */
export function getMajorStatus(
  obj           : Item,
  currentStatus : Item,
  newStatus     : Item
): Item {
  const curPos = getValuePosition(obj, currentStatus);
  const newPos = getValuePosition(obj, newStatus);


  return newPos > curPos ? newStatus : currentStatus;
}
