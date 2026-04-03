
/**
 * Default
 */
  // @ts-ignore
const validate = (entities, field, value, id) => entities[id]?.[field] === value;

/**
 * If entities[id][field] is array
 */
  // @ts-ignore
const includesValidate = (entities, field, value, id) => entities[id]?.[field]?.includes(value);

/**
 * Check by one of in Value
 */
  // @ts-ignore
const valueIsArray = (entities, field, value, id) => value.includes(entities[id]?.[field]);

/**
 * For recived validFunc
 */
  // @ts-ignore
const validatorFunc = (entities, field, _, id, validFunc) => validFunc(entities[id]?.[field]);


  // @ts-ignore
const getValidator = (value, includes, validFunc) => validFunc
  ? validatorFunc
  : Array.isArray(value)
      ? valueIsArray
      : includes
          ? includesValidate
          : validate;



interface Entities<O extends object> {
  [id: string]: O
}

/**
 * Filter entities by field and value - entities[id][field] === value
 * @param ents
 * @param field     - field for filter
 * @param value     - checked value
 * @param includes  - if entities[id][field] is array
 * @param validFunc
 */
export function filterEntsByField<O extends object, T>(
  entities   : Entities<O>,
  field      : string,
  value      : T | T[],
  includes?  : boolean,
  // eslint-disable-next-line
  validFunc? : Function
): Entities<O> {
  const ents = {};
  if (!field || typeof value === 'undefined') return ents;

  const validator = getValidator(value, includes, validFunc);

  // eslint-disable-next-line
  for (const id in entities) {
    if (Object.prototype.hasOwnProperty.call(entities, id)) {
  // @ts-ignore
      if (validator(entities, field, value, id, validFunc)) ents[id] = entities[id];
    }
  }

  return ents;
}
