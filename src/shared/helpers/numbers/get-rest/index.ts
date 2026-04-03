import { isUndefined } from 'shared/lib/validators';


/** Возвращает число после запятой */
export const getRest = (value: number | undefined): number | undefined => {
  if (isUndefined(value) || (! value && value !== 0)) return undefined;

  const num = String(value); // преобразуем число в строку
  return +num.split('.')[1] || 0; // получаем вторую часть строки после десятичной точки
}
