import { Item } from '..';

/**
 * Возвращает массив без указанного элемента по itemField
 */
export function getArrWithoutItemByTwoFields(
  items    : Item[],
  fieldOne : string, // `taskId`
  fieldTwo : string, // `userId`
  delItem  : Item)
: Item[] {
  const idx = items.findIndex((item) => item[fieldOne] === delItem[fieldOne]
    && item[fieldTwo] === delItem[fieldTwo]);

  let newItems = [...items];
  if (idx !== -1) {
    newItems = [...newItems.slice(0, idx), ...newItems.slice(idx + 1)];
  }

  return newItems;
}
