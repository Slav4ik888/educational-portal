
export const isDotComma = (str: string): boolean => /[,.]/g.test(str);
export const isDot      = (str: string): boolean => /\./g  .test(str);
export const isComma    = (str: string): boolean => /,/g   .test(str);
export const commaToDot = (str: string): string => str.replace(/,/g, '.');
export const dotToComma = (str: string): string => str.replace(/\./g, ',');
export const delSpace   = (str: string): string => str.replace(/\s/g, '');
export const getDigit   = (str: string): string => str.replace(/\D/g, '');
export const isDigit    = (str: string): boolean => /\d/g.test(str);
