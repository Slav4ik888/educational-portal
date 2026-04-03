
/**
 * Удаляет свойство объекта по заданной схеме, если его значение не undefined.
 * Поддерживает вложенные объекты и массивы (например, 'items[0].prop').
 * Мутирует исходный объект!
 *
 * @param obj Исходный объект.
 * @param scheme Схема пути к свойству (например, 'a.b[0].c').
 * @returns true, если свойство было удалено, иначе false.
 */
export function removePropertyIfDefined(obj: Record<string, any>, scheme: string): boolean {
 const keys = scheme.split(/\.|\[|\]/).filter(Boolean);
 let current = obj;

 for (let i = 0; i < keys.length - 1; i++) {
   const key = keys[i];

   if (current[key] === undefined || current[key] === null) {
     return false;
   }

   // Обработка массивов (ключ вида "0")
   if (/^\d+$/.test(key) && Array.isArray(current)) {
     const index = parseInt(key, 10);
     if (index >= current.length) return false;
     current = current[index];
   } else if (typeof current[key] === 'object') {
     current = current[key];
   } else {
     return false;
   }
 }

 const lastKey = keys[keys.length - 1];
 if (current[lastKey] !== undefined) {
   delete current[lastKey];
   return true;
 }

 return false;
}

// const obj = {
//   data: [
//     { id: 1, values: [10, 20] },
//     { id: 2, values: [30, 40] }
//   ]
// };

// removePropertyIfDefined(obj, 'data[0].values[1]');
// Результат: data[0].values = [10] (элемент удален)
