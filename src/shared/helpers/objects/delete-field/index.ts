import { isUndefined } from 'shared/lib/validators';


/**
 * Удаляет поле у объекта,
 * если поле отсутствует, то ничего не делает
 */
export function deleteField<T extends object>(obj: T, field: keyof T) {
  if (isUndefined(obj?.[field])) return
  delete obj[field];
}
