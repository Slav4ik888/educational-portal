import { isArr, isObj, isStr, isNotObj } from 'shared/lib/validators';

const s = (str: string, key: string) => `${str ? ', ' : ''}${key}: `;

/**
 * Возвращает названия всех полей и их значений в виде строки
 * v.22.30.09
 */
export const objectFieldsToString = (obj: object | string): string => {
  if (!obj)       return '';
  if (isStr(obj)) return obj as string;
  if (isNotObj(obj)) return JSON.stringify(obj);

  if (!Object.keys(obj).length) return obj as unknown as string;

  let str = '';

  // eslint-disable-next-line
  for (const key in obj as object) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
  // @ts-ignore
      if (isObj(obj[key]))      str += `${s(str, key)}{ ${objectFieldsToString(obj[key])} }`;
  // @ts-ignore
      else if (isArr(obj[key])) str += `${s(str, key)}${objectFieldsToString(obj[key])}`;
  // @ts-ignore
      else str += `${s(str, key)}${obj[key]}`;
    }
  }
  return str;
};
