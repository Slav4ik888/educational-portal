
const addSpaces = (str: string, needSpace: number): string => {
  let newStr = str;

  [...new Array(needSpace)].forEach(() => {
    newStr += ' ';
  });

  return newStr;
};


/**
 * Возвращает строку заданной длины
 */
export const strWithLength = (str: string, length: number): string => {
  if (!str || typeof str !== 'string') return str;
  if (typeof length !== 'number') return '';

  const needSpace = length - str.length;
  if (needSpace < 0) return str.slice(0, length);
  if (!needSpace) return str;
  if (needSpace > 0) return addSpaces(str, needSpace);
  return ''
};
