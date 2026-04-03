import { isNotObj, isNotStr } from '../../../lib/validators';
/* eslint-disable */

export function isField<T>(obj: T, field: string): boolean {
  if (! obj || isNotObj(obj) || ! field || isNotStr(field)) return false;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (key === field) return true
    }
  }

  return false;
}
