import { deepEqual } from '../deep-equal';


type AnyObject = Record<string, any>

/**
 * TODO: если использовать, то надо уладить ситуации когда объекты не определены ({ a: undefined })
 * Эта функция проходит по всем свойствам объектов и сравнивает их с помощью deepEqual.
 * Если найдены различия, они добавляются в объект differences с указанием пути к свойству.
 */
export function findDifferences(obj1: AnyObject, obj2: AnyObject): Record<string, { obj1: any; obj2: any }> {
  const differences: Record<string, { obj1: any; obj2: any }> = {};

  function compareObjects(o1: AnyObject, o2: AnyObject, path: string = '') {
    const keys = new Set([...Object.keys(o1 || {}), ...Object.keys(o2 || {})]);

    keys.forEach(key => {
      const currentPath = path ? `${path}.${key}` : key;

      if (typeof o1[key] === 'object' && o1[key] !== null && typeof o2[key] === 'object' && o2[key] !== null) {
        if (Array.isArray(o1[key]) && Array.isArray(o2[key])) {
          if (o1[key].length !== o2[key].length) {
            differences[currentPath] = { obj1: o1[key], obj2: o2[key] };
          } else {
            for (let i = 0; i < o1[key].length; i++) {
              if (!deepEqual(o1[key][i], o2[key][i])) {
                differences[`${currentPath}[${i}]`] = { obj1: o1[key][i], obj2: o2[key][i] };
              }
            }
          }
        } else {
          compareObjects(o1[key], o2[key], currentPath);
        }
      } else if (o1[key] !== o2[key]) {
        differences[currentPath] = { obj1: o1[key], obj2: o2[key] };
      }
    });
  }

  compareObjects(obj1, obj2);
  return differences;
}

// Пример использования:
// const obj1 = {
//     a: 1,
//     b: [1, 2, 3],
//     c: { d: 4, e: [5, 6] }
// };

// const obj2 = {
//     a: 1,
//     b: [1, 2, 4],
//     c: { d: 4, e: [5, 7] }
// };

// console.log(findDifferences(obj1, obj2));
// Вывод:
// {
//   'b[2]': { obj1: 3, obj2: 4 },
//   'c.e[1]': { obj1: 6, obj2: 7 }
// }
