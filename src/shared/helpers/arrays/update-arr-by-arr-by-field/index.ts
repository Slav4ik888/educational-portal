import { Item } from '..';

/**
 * Update lastArr by newArr by field, все не обновлённые объекты остаются без изменений
 */
export function updateArrByArrByField(
  lastArr: Item[], field: string, newArr: Item[]
): Item[]  {
  if (! lastArr?.length) return newArr;

  const updatedArr = [...newArr];

  lastArr.forEach(item => {
    const res = updatedArr.find(updated => updated[field] === item[field]);
    if (!res) updatedArr.push(item);
  });

  return updatedArr;
}
