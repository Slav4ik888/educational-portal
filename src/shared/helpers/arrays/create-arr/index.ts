import { isObj } from 'shared/lib/validators';

/**
 * v.2023-07-30
 * Create array for mocks
 */
export function createArr<T>(length: number, fillItem?: T): T[] {
  if (! length) return []

  return new Array(length)
    .fill(0)
    .map((_) => {
      if (! fillItem) return '-'
      if (isObj(fillItem)) return { ...fillItem }
      return fillItem
    }) as unknown as T[];
}
