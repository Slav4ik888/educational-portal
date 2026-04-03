import { isNotNum } from 'shared/lib/validators'
import { addZeroToRest } from '../add-zero-to-rest';



export interface Config {
  fractionDigits? : number
  addZero?        : boolean // добавляет нули в конце
}


/**
 * Возвращает число с обрезанными десятичными, по заданную длину
 * при необходимости добавляет нули
 */
export const getFixedFraction = (
  value  : number | undefined,
  config : Config = {}
): string => {
  if ((!value && value !== 0) || isNotNum(value)) return '';

  const fractionDigits = config.fractionDigits || 0;

  if (config.addZero) {
    return value.toFixed(fractionDigits);
  }
  else {
    // Для случая без добавления нулей, просто обрезаем лишние цифры без округления
    const parts = String(value).split('.');
    if (fractionDigits === 0 || !parts[1]) {
      return parts[0];
    }
    return `${parts[0]}.${parts[1].substring(0, fractionDigits)}`;
  }
};
