// v. 02-04-2023
import { isNotStr } from '../../is-str';

/**
 * DEPRECATED 2023-05-08
 * True  if str <= maxLength
 * False if not string | > maxLength
 */
export const isValidMaxL = (maxLength: number, str: string): boolean => {
  if (!str && isNotStr(str)) return false;
  if (str?.length < maxLength || str?.length === maxLength) return true;

  return false // console.log(`Нет совпадений по условиям...`);
};

export const isValidMaxL30   = (str: string): boolean => isValidMaxL(30, str);
export const isValidMaxL50   = (str: string): boolean => isValidMaxL(50, str);
export const isValidMaxL100  = (str: string): boolean => isValidMaxL(100, str);
export const isValidMaxL300  = (str: string): boolean => isValidMaxL(300, str);
export const isValidMaxL500  = (str: string): boolean => isValidMaxL(500, str);
export const isValidMaxL1000 = (str: string): boolean => isValidMaxL(1000, str);


export const noValidMaxL     = (maxLength: number, str: string): boolean => !isValidMaxL(maxLength, str);
export const noValidMaxL30   = (str: string): boolean => !isValidMaxL(30, str);
export const noValidMaxL50   = (str: string): boolean => !isValidMaxL(50, str);
export const noValidMaxL100  = (str: string): boolean => !isValidMaxL(100, str);
export const noValidMaxL300  = (str: string): boolean => !isValidMaxL(300, str);
export const noValidMaxL500  = (str: string): boolean => !isValidMaxL(500, str);
export const noValidMaxL1000 = (str: string): boolean => !isValidMaxL(1000, str);
