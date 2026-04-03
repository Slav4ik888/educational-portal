import { isObj } from 'shared/lib/validators';
import { objectLength as length, getFirstFieldKey as getKey } from '../../objects';


/**
 * Возвращает массив без указанного элемента
 *  => if field === undefined & value length === 1, use field = field of value, else return items
 */
export function getArrWithoutItem<T>(
  items  : T[],
  value  : Partial<T> | string | number,
  field? : string
): T[] {
  if (! items?.length) return [];
  if (! value) return items;

  if (isObj(items[0])) {
    if (isObj(value)) {
      // @ts-ignore
      if (field) return (items as T[]).filter(item => item[field] !== (value as Partial<T>)[field]);

        if (length(value as object) === 1) {
          const fieldValue = getKey(value as object);
          if (fieldValue) return (items as T[])
          // @ts-ignore
            .filter(item => item[fieldValue] !== (value as Partial<T>)[fieldValue])
        }
    }
    // @ts-ignore
    else return (items as T[]).filter(item => item[field as string] !== value);
  }
  else if (typeof value !== 'object') return (items as Array<any>)
    .filter(item => (item as unknown as string | number) !== value);

  return items;
}
