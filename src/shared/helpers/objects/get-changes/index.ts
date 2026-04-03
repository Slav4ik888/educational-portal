/* eslint-disable */
import { isArrsEqual } from '../../arrays';
import { isArr, isUndefined, isObj, isNotObj } from '../../../lib/validators';
import { setValueByScheme } from '../set-value-by-scheme';



/**
 * Check updObj of new field, that absent in prevObj
 * Add new field to newObj
 */
const checkAndAddNewField = (newObj: object, prevObj: object, updObj: object, prevScheme: string = ''): void => {
  if (isNotObj(updObj)) return

  for (const key in updObj) {
    const scheme = prevScheme ? `${prevScheme}.${key}` : key;

    if (Object.prototype.hasOwnProperty.call(updObj, key)) {
  // @ts-ignore
      const updValue = updObj[key];

  // @ts-ignore
      if (isUndefined(prevObj[key])) { // New field
        setValueByScheme(newObj, scheme, updValue);
        continue;
      }

  // @ts-ignore
      checkAndAddNewField(newObj, prevObj[key], updValue, scheme);
    }
  }
};



/** Check is Array or any type and save */
const checkIfNotObj = (newObj: object, prevValue: unknown, updValue: unknown, scheme: string) => {
  if (isArr(prevValue as unknown as object[])) {
    if (! isArrsEqual(prevValue as unknown as object[], updValue as unknown as object[]))
      setValueByScheme(newObj, scheme, updValue);
  }
  else if (prevValue !== updValue) setValueByScheme(newObj, scheme, updValue);
};



const checkChanges = (newObj: object, prevObj: object, updObj: object, prevScheme: string = ''): void => {
  for (const key in prevObj) {
    const scheme = prevScheme ? `${prevScheme}.${key}` : key;

    if (Object.prototype.hasOwnProperty.call(prevObj, key)) {
      const
  // @ts-ignore
        value = prevObj[key],
  // @ts-ignore
        updValue = updObj[key];
      if (isUndefined(updValue)) continue; // В этом элементе не было изменений

      if (isObj(value)) {
        checkChanges(newObj, value, updValue, scheme);
      }
      else {
        checkIfNotObj(newObj, value, updValue, scheme);
      }
    }
  }
};


/**
 * v.2023-05-16
 * Возвращает объект с теми полями, которые были изменены по отношению к первоначальному объекту
 * ! Возможная глубина вложения 8 (ограничено ф-ей setValueByScheme)
 * ! Нельзя использовать при удалении полей - если в новом объекте нет какого-то поля, то это поле в старом объекте не удалиться
 * @param prevObj - первоначальный объект
 * @param updObj  - новый объект
 */
export function getChanges<T extends object>(prevObj: T | undefined, updObj: Partial<T>): Partial<T> {
  if ((! prevObj && ! updObj) || ! updObj) return {};
  if (! prevObj) return updObj;

  const newObj = {};

  // CHECK prevObj
  checkChanges(newObj, prevObj, updObj);

  // CHECK new field in updObj
  checkAndAddNewField(newObj, prevObj, updObj);

  return newObj
}
