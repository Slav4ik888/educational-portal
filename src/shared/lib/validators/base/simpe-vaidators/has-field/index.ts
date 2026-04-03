import { isNotObj } from '..';

/**
 * v.2023-05-08
 * True if the data has this field
 */
export const isHasField = (data: object, field: string): boolean => {
  if (isNotObj(data)) return false
  if (Object.prototype.hasOwnProperty.call(data, field)) return true
  return false
};

export const isNotHasField = (data: object, field: string): boolean => ! isHasField(data, field);
