
type Obj = {
  [key: string]: any
}


/**
 * v.2025-07-20
 * Object value by scheme
 * Поддерживает схемы с вложенными массивами в двух форматах:
 * 'field1.child1.[1].child3' (старый)
 * 'field1.child1[1].child3' (новый, без точки перед индексом)
 */
export function getValueByScheme(obj: any, scheme: string): any {
  if (!obj || !scheme) return undefined;

  // Нормализуем схему: 'field[1]' -> 'field.[1]' для единообразия
  const normalizedScheme = scheme.replace(/(\w+)\[(\d+)\]/g, '$1.[$2]');
  const fields = normalizedScheme.split('.').filter(Boolean);

  return fields.reduce((current, field) => {
    if (current === undefined || current === null) return undefined;

    if (field.startsWith('[') && field.endsWith(']')) {
      // Обработка массива
      const index = parseInt(field.slice(1, -1), 10);
      return Array.isArray(current) ? current[index] : undefined;
    }

    // Обработка объекта
    return current[field];
  }, obj);
}


/**
 * DEPRACATEDD v.2025-05-28
 * v.2025-01-10
 * Object value by scheme
 * Поддерживает только вложенные объекты, not arrays
 */
// export function getValueBySchemeOld2(obj: Obj | undefined, scheme: string): any {
//   if (! obj || ! scheme) return undefined;

//   const fields = scheme.split('.');

//   if (fields.length === 0) return obj
//   if (fields.length === 1) return obj?.[fields[0]]

//   const newSchema = fields.slice(1).join('.');
//   return getValueByScheme(obj?.[fields[0]], newSchema);
// }


/**
 * DEPRACATEDD v.2025-01-10
 * v.2023-05-28
 * Object value by scheme, else false
 * Поддерживает только вложенные объекты, not arrays
 * max вложенность = 8
 */
// export function getValueBySchemeOld<O extends object>(obj: O, scheme: string): any {
//   if (! obj || ! scheme) return undefined;

//   const fields = scheme.split('.');

//   if (fields.length === 0 || fields.length > 8) return undefined
//   // @ts-ignore
//   if (fields.length === 1) return obj[fields[0]]
//   // @ts-ignore
//   if (fields.length === 2) return obj[fields[0]]?.[fields[1]]
//   // @ts-ignore
//   if (fields.length === 3) return obj[fields[0]]?.[fields[1]]?.[fields[2]]
//   // @ts-ignore
//   if (fields.length === 4) return obj[fields[0]]?.[fields[1]]?.[fields[2]]?.[fields[3]]
//   // @ts-ignore
//   if (fields.length === 5) return obj[fields[0]]?.[fields[1]]?.[fields[2]]?.[fields[3]]?.[fields[4]]
//   // @ts-ignore
//   if (fields.length === 6) return obj[fields[0]]?.[fields[1]]?.[fields[2]]?.[fields[3]]?.[fields[4]]?.[fields[5]]
//   // @ts-ignore
//   if (fields.length === 7) return obj[fields[0]]?.[fields[1]]?.[fields[2]]?.[fields[3]]?.[fields[4]]?.[fields[5]]?.[fields[6]]
//   // @ts-ignore
//   if (fields.length === 8) return obj[fields[0]]?.[fields[1]]?.[fields[2]]?.[fields[3]]?.[fields[4]]?.[fields[5]]?.[fields[6]]?.[fields[7]]
// }
