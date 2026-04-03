/**
 * v.2025-07-11
 * Возвращает новый объект prevObj с обновлёнными полями из updFields
 * (который может содержать и другие поля, которых нет в prevObj)
 * Обновляет атомарно
 * Not deleted fields
 */
export function updateObject<T extends object | undefined, O extends Partial<T & any>>(
  original: T,
  updates: O | undefined
): T & O | T {
  if (! original && ! updates) return {} as T;
  if (original && ! updates) return original;
  if (! original && updates) return updates as unknown as T;

  // Если updates не объект или null, возвращаем updates (заменяем полностью)
  if (typeof updates !== 'object' || updates === null) {
    return original;
  }

  // Create a shallow copy of original (to avoid mutation)
  const result = Array.isArray(original) ? [...original] : { ...original };

  // Iterate over updates using Object.entries() (avoids prototype chain issues)
  Object.entries(updates).forEach(([key, value]) => {
    // If both original[key] and updates[key] are objects (and not arrays), recurse
    if (
      // @ts-ignore
      typeof original?.[key] === 'object'
      // @ts-ignore
      && original?.[key] !== null
      && typeof value === 'object'
      && value !== null
      && ! Array.isArray(value) // Arrays are replaced entirely (modify if needed)
    ) {
      // @ts-ignore
      result?.[key] = updateObject(original?.[key], value);
    } else {
      // Otherwise, assign the new value
      // @ts-ignore
      result?.[key] = value;
    }
  });

  return result as T & O;
}
