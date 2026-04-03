import { isDotComma, getDigit, commaToDot, dotToComma } from '../replacers';
import { addSpaceBetweenNumbers } from '../add-space-between-numbers';



/**
 * v.2025-03-25
 * Для handleChange(e)
 * Возвращает число в строке с разделёнными тысячами
 */
export function getStrNumber(value: string): string {
  let str = '';
  // @ts-ignore
  if (! value && value !== 0) return '';

  const valInStr = value.toString();
  const isNegative = valInStr[0] === '-'; // Save value '-' if present

  for (let i = 0; i < valInStr.length; i++) {
    if (isDotComma(valInStr[i])) {
      if (! isDotComma(str)) str += valInStr[i] // Comma or Dota must be one
    }
    else str += getDigit(valInStr[i]);
  }
  // Предусмотреть ситуацию, если в конце поставили запятую,
  // то после addSpaceBetweenNumbers, её нужно вернуть обратно, тк он её удалит
  const isLastComma = str[str.length - 1] === ',';
  str = addSpaceBetweenNumbers(commaToDot(str));
  str = dotToComma(str);

  if (isLastComma) str += ',';

  return isNegative ? `-${str}` : str;
}
