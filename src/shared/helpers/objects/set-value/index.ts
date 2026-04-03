import { isNotUndefined } from '../../../lib/validators';


/**
 * Если отсутствует входящее значение, то подставляет defaultValue
 */
export function setValue<T>(input: T, defaultValue: T): T {
  return isNotUndefined(input) ? input : defaultValue;
}
