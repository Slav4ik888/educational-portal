import { isNotStr } from 'shared/lib/validators'
import { capitalize } from '../capitalize'



/**
 * Capitalize first char
 * v.2025-01-03
 */
export const capitalizeFirst = (str: string): string => {
  if (isNotStr(str)) return ''

  return capitalize(str, { first: true });
}
