import { isNotNum } from 'shared/lib/validators';

/**
 * v.2023-06-22
 * Returns the last digit in a number
 */
export const getLastDigit = (
  num           : number,
  needTwoDigit? : boolean
): number => {
  if (isNotNum(num) || num < 10) return num

  const div = needTwoDigit ? 100 : 10;

  return Math.round((num / div - Math.floor(num / div)) * div)
};
