/**
 * v.2024-03-02
 * id ставит после after
 * При отсутствии after - id добавляется в конец
 */
export const changeSequence = (arr: string[], id: string, after?: string): string[] => {
  if (! arr || ! arr.length) return [id]

  const newArr = [];
  let pushed = false;

  arr.forEach(arrId => {
    if (arrId !== id) {
      newArr.push(arrId);
    }
    if (arrId === after) {
      newArr.push(id);
      pushed = true;
    }
  })

  if (! pushed) newArr.push(id);

  return newArr;
};
