import type { Item } from '../types';

/**
 * Возвращает item by two values
 */
export function getItemFromArrByTwoField<FF, FS>(
  arr         : Item[],
  fieldFirst  : string,
  valueFirst  : FF,
  fieldSecond : string,
  valueSecond : FS
): Item | undefined {
  if (! fieldFirst || ! fieldSecond) return undefined;

  return arr?.find((item) => item?.[fieldFirst] === valueFirst
                             && item?.[fieldSecond] === valueSecond);
}
