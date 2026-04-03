
/** Возвращает обрезанную строку заданной длины */
export const sliceStr = (maxLength: number, str: string): string => {
  let newStr = String(str) || '';
  if (newStr?.length > maxLength) newStr = newStr.slice(0, maxLength);

  return newStr;
};

export const sliceStr30   = (str: string): string => sliceStr(30, str);
export const sliceStr300  = (str: string): string => sliceStr(300, str);
export const sliceStr1000 = (str: string): string => sliceStr(1000, str);
