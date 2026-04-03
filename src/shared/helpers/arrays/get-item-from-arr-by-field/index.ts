import type { Item } from '../types';

/**
 * Возвращает item с соответствующим полем field === value
 */
export function getItemFromArrByField(
  arr   : Item[],
  field : string, // `id` || `email` || any
  value : string | number
): Item | undefined {
  return arr?.find((item) => item?.[field] === value);
}
