/* eslint-disable */
import { cloneObj } from '../objects';

export function getObjectWithoutField<T>(obj: T, field1: string, field2?: string): T {
  if (!obj) return {} as T;
  if (!field1 || typeof field1 !== 'string') return obj;
  if (typeof field2 !== 'undefined' && typeof field2 !== 'string') return obj;

  const newObj = cloneObj(obj);

  for (const key in newObj) {
    if (Object.prototype.hasOwnProperty.call(newObj, key)) {
      if (key === field1) {
        if (field2) {
          for (const key2 in newObj[key]) {
            if (Object.prototype.hasOwnProperty.call(newObj[key], key2)) {
  // @ts-ignore
              if (key2 === field2) delete newObj[field1][field2]
            }
          }
  // @ts-ignore
        } else delete newObj[field1];
      }
    }
  }

  return newObj;
}
