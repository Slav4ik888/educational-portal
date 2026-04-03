import { Item } from '../types';

function isValid(item: Item, field: string, values: string[]): boolean {
  let result = true;

  values.forEach(value => {
    if (item[field] === value) result = false
  });

  return result;
}


export function getArrWithoutItems(arr: Item[], field: string, values: string[]): Item[] {
  if (!arr?.length || !field || !values?.length) return arr;

  return arr.filter(item => isValid(item, field, values))
}
