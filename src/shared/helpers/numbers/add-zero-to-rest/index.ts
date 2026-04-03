import { createArr } from '../../arrays';
import { isUndefined } from '../../../lib/validators';
import { getRest } from '../get-rest';


/**
 * Добавляет необходимое кол-во нулей к числу после запятой
 * zero 5: 123.12 => 123.12000
 */
export const addZeroToRest = (value: number | undefined, countZero: number = 0): string => {
  if (isUndefined(value) || (! value && value !== 0)) return '';

  const rest = getRest(value);
  const withoutRest = Math.trunc(value);

  const restString = (String(rest) + createArr(countZero, '0').join('')).slice(0, countZero);

  return withoutRest + (restString ? `.${restString}` : '');
}
