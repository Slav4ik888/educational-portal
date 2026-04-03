import { isHasField } from '../has-field';
import { isUndefined } from '../is-undefined';

/**
 * v.2023-05-08
 * True if field is present, but value is undefined
 */
export const isFieldValueUndefined = (data: object, field: string): boolean =>
  // @ts-ignore
  isHasField(data, field) && isUndefined(data[field]);
