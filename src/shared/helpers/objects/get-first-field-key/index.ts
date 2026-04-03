/**
 * Return key of object with 1 value
 */
export function getFirstFieldKey<O extends object>(obj: O): string {
  if (typeof obj !== 'object') return '';

  const key = Object.keys(obj);
  if (!key.length || key.length > 1) return '';

  return key[0];
}
