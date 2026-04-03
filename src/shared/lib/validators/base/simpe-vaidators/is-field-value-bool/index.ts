import { isHasField } from '../has-field';
import { isBool } from '../is-bool';

/**
 * v.2023-05-08
 * True if field is present, but value is boolean
 */
export const isFieldValueBool = (data: object, field: string): boolean =>
  // @ts-ignore
  isHasField(data, field) && isBool(data[field]);
