// v.01-04-2023

/**
 * Return true if obj has a field other than the schema
 */
export function hasAnyField<O extends object, S extends object>(obj: O, schema: S): boolean {
  let result = false;

  if (! obj || ! schema) return result;


  const
    schemaFields = Object.keys(schema),
    objFields = Object.keys(obj);


  objFields.forEach(field => {
    if (! schemaFields.includes(field)) result = true
  });

  return result
}
