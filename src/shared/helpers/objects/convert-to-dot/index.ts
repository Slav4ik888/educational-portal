import { isObj } from 'shared/lib/validators';
import { isEmpty } from '..';



function checkAndConvert<O extends object>(obj: O, newObj: object, prevScheme: string = ''): void {
  // eslint-disable-next-line
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const
        value  = obj[key],
        scheme = prevScheme ? `${prevScheme}.${key}` : key;

      if (isObj(value)) {
        checkAndConvert(value as unknown as object, newObj, scheme);
      }
      else {
  // @ts-ignore
        newObj[scheme] = value;
      }
    }
  }
}


/**
 * v.2023-05-19
 * Convert object to dot notation like this
 * @example { first: { second: { third: 'field' }}} => { 'first.second.third': 'field' }
 */
export function convertToDot<O extends object>(obj: O): object {
  if (! obj || isEmpty(obj)) return {}

  const newObj = {};

  checkAndConvert(obj, newObj);

  return newObj;
}
