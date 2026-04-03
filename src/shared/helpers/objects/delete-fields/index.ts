import { isNotArr, isUndefined } from 'shared/lib/validators';
import { deleteField } from '../delete-field';


/**
 * Удаляет несколько полей у объекта,
 * если поле отсутствует, то ничего не делает
 */
export function deleteFields<T extends object>(obj: T, arr: Array<keyof T>) {
  if (isNotArr(arr) || ! arr || ! arr.length) return;
  if (isUndefined(obj)) return;

  arr.forEach(item => deleteField(obj, item));
}
