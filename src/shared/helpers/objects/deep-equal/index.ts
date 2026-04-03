
type AnyObject = Record<string, any>

/**
 * Рекурсивно сравнивает два объекта или массива.
 * Она проверяет типы, длины массивов, и значения всех свойств.
 */
export function deepEqual<AnyObject>(obj1: AnyObject, obj2: AnyObject): boolean {
  // Если оба объекта являются null или undefined, они равны
  if (obj1 === null && obj2 === null) return true;
  if (obj1 === undefined && obj2 === undefined) return true;

  // Если один из объектов null или undefined, они не равны
  if (obj1 === null || obj2 === null) return false;
  if (obj1 === undefined || obj2 === undefined) return false;

  // Если типы объектов разные, они не равны
  if (typeof obj1 !== typeof obj2) return false;

  // Если это примитивы, сравниваем их значения
  if (typeof obj1 !== 'object') return obj1 === obj2;

  // Если это массивы, сравниваем их элементы
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false;
    for (let i = 0; i < obj1.length; i++) {
      if (!deepEqual(obj1[i], obj2[i])) return false;
    }
    return true;
  }

  // Если это объекты, сравниваем их свойства
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  // eslint-disable-next-line
  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    // @ts-ignore
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}
