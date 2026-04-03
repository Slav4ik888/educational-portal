import { isNotNum, isNotStr } from 'shared/lib/validators';
import { getArrWithoutItem } from '../get-arr-without-item';


export function getArrWithoutItemById<T>(items: T[], value: string | number): T[] {
  if (isNotStr(value) && isNotNum(value)) return items;

  return getArrWithoutItem(items, { id: value } as unknown as Partial<T>)
}
