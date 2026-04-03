import { Item } from '../types';
import { updateArrWithItemByField } from '../update-arr-with-item-by-field';

/**
 * v.2024-03-26
 * Возвращает массив с обновлённым item by id
 *
 * Если нет массива items, то создаёт его
 *
 * @param {Item[]} items
 * @param {object} updateItem
 * @param {string | array} flags - если 'update', то в обновляемом объекте, обновляются только
 * те поля что переданы в updateItem, остальные имеющиеся остаются без изменений
 * - если есть 'after', то следующий нужно добавить id элемента после которого нужно добавить updateItem,
 *   ['after', 'id-123']
 *   если updateItem уже есть то просто обновляем, если его нет, то добавляем после after
 */
export function updateArrById(
  items      : Item[],
  updateItem : Partial<Item>,
  flags?     : string | string[],
): Item[] {
  return updateArrWithItemByField(items, 'id', updateItem, flags);
}
