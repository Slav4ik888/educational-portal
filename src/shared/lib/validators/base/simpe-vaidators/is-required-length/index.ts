import { isUndefined } from '../is-undefined'

/** True if Str.length === mustLength */
export const isRequiredLength = (str: string, mustLength: number): boolean => {
  if (isUndefined(str) || isUndefined(mustLength)) return false
  if (str.length === mustLength) return true

  return false
}
