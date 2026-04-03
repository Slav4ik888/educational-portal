/**
 * Возвращает дату в виде миллисекунд
 */
export function getMsFromDate(date: string | Date): number {
  if (! date) return 0;

  return new Date(date).getTime();
}
