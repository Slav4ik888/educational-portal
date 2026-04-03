import { isNotObj, isUndefined } from 'shared/lib/validators';



/**
 * Проверяем есть ли такое поле и если есть обнуляем.
 * Применяется есть поле удалить нельзя, тк оно не сохраниться на сервере,
 * а весь объект не будем перезаписывать. Обнуляем поле и оно как бы не рабочее.
 */
export function setFieldEmpty<T>(obj: T, field: keyof T): void {
  if (isNotObj(obj) || isUndefined(obj[field])) return

  (obj as Record<keyof T, any>)[field] = '';
}
