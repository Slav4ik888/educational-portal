
export const isEmptyStr = (str: string): boolean => {
  if (typeof str !== 'string') return true;
  if (! str || str.trim() === '') return true;
  return false;
};

export const isNotEmptyStr = (str: string): boolean => ! isEmptyStr(str);
