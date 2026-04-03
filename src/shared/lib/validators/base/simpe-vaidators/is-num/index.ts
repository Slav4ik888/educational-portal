
/** v.2023-06-22 */
export const isNum = (num: any): boolean =>
  typeof num === 'number'
  && !isNaN(num);

export const isNotNum = (num: any): boolean => !isNum(num);
