import { isArr } from 'shared/lib/validators';
import { cloneObj, updateObject } from '../../objects';



/**
 * v.2024-03-26
 * Возвращает массив с обновлённым item
 * Если нет массива items, то создаёт его
 *
 * @param {T} items
 * @param {string} field -
 * @param {object} updateItem
 * @param {string | array} flags -
 * @return {array} items
 */
export function updateArrWithItemByField<T>(
  items      : T[],
  field      : string,          // поле по которому ищется объект: 'id' || 'email' || any
  updateItem : Partial<T>,
  flags?     : string | string[] // - если стоит 'update', то в обновляемом объекте, обновляются только
                                 //   те поля что переданы в updateItem, остальные имеющиеся остаются без изменений
                                 // - если есть 'after', то следующий нужно добавить id элемента после которого нужно добавить updateItem,
                                 //   ['after', 'id-123']
                                 //   если updateItem уже есть то просто обновляем, если его нет, то добавляем после after
): T[] {
  if (! updateItem) return items

  let newItems = [] as T[];

  // Если нет массива items, то создаём его
  if (! items) {
    newItems.push(updateItem as T);
    return newItems;
  }


  // @ts-ignore
  const idx = items.findIndex((item) => item?.[field] === updateItem[field]);
  newItems = [...items];

  // Если есть - обновляем
  if (idx !== -1) {
    let newUpdateItem = cloneObj(updateItem);

    // Если указан флаг, обрабатываем
    if (flags?.includes('update')) {
      // @ts-ignore
      newUpdateItem = updateObject(items[idx], updateItem);
    }

    return [...newItems.slice(0, idx), newUpdateItem as T, ...newItems.slice(idx + 1)];
  }
  // Нету - добавляем

    // If flags is array
    if (isArr(flags as string[])) {
      const idxAfter = (flags as string[])?.findIndex((str) => str === 'after');

      // If flags contains id after 'after'
      const afterId = flags?.[idxAfter + 1];

      if (idxAfter !== -1 && afterId) {
        // Есть ли afterId in Arr
        // @ts-ignore
        const idxAfterInArr = items.findIndex((item) => item[field] === afterId);

        // Add after 'after'
        if (idxAfterInArr !== -1) {
          return [
            ...newItems.slice(0, idxAfterInArr + 1),
            cloneObj(updateItem) as T,
            ...newItems.slice(idxAfterInArr + 1)
          ];
        }
        // В конец
      }
    }
    // else {
    // }

    newItems.push(updateItem as T);
    return newItems;
}
