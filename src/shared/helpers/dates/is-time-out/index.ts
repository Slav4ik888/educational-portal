import { isNum } from 'shared/lib/validators';
import { getCurrentMs } from '../get-current-ms';

/**
 * Возвращает вышло ли время ожидания
 * @param {string | number} lastTime - предыдущее время
 * @param {number} waiting  - ожидание в ms
 * v.23-04-20
 */
export function isTimeOut(
  lastTime : string | number, // предыдущее время
  waiting  : number  // ожидание в ms
): boolean {
  if (!lastTime) return true;

  const
    lastTimeMs = (isNum(lastTime) ? lastTime : Date.parse(lastTime as string)) as number,
    currentTimeMs = getCurrentMs();

  return waiting < currentTimeMs - lastTimeMs;
}
