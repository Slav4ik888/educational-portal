import { isNotObj, isUndefined } from 'shared/lib/validators';



export type Obj = {
  [key: string]: any
}

/**
 * Меняет поле объекта если value не undefined. Если obj не объект, то возвращает value
 * @param obj
 * @param value - значение, если undefined, то ничего не добавляется
 * @param field - название поля (если obj объект)
 */
export function setIfNotUndefined<T extends Obj | string>(
  obj    : T,
  value  : any,
  field? : keyof T,
): T | string {
  if (isUndefined(value)) return obj

  if (field) {
    if (isNotObj(obj)) {
      return value;
    }

      // @ts-ignore
      if (isUndefined(obj[field])) (obj)[field] = '';
      obj[field] = value;
      return obj;
  }

    return value;
}
