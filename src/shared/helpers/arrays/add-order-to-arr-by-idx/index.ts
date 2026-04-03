/**
 * 2024-03-08
 * Возвращает массив с обновлёнными order по возрастанию
 */
export function addOrderToArrByIdx<T extends { order: string }>(arr: Array<T>): Array<T> {
  return arr.map((item, i) => {
    item.order = String(100 + i * 100);
    return item;
  })
}
