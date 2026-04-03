import { getItemFromArrByField } from '../get-item-from-arr-by-field';
import type { Item } from '../types';


/** v.2023-09-17 */
export function getItemById(arr: Item[], id: string | number): Item | undefined {
  return getItemFromArrByField(arr, 'id', id);
}
