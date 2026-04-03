import { Item } from '../types';

export function updateArrBySomeChanges(
  arr: Item[], field: string, changesArr: string[], obj: Partial<Item>): Item[] {
  if (!arr?.length) return [];

  const newArr = [] as Item[];

  arr.forEach(lastItem => {
    const res = changesArr.find(ch => ch === lastItem[field]);
    if (res) newArr.push({ ...lastItem, ...obj });
    else newArr.push(lastItem)
  })

  return newArr;
}
