
/** Is typeof string */
export const isStr = (str: unknown): boolean => typeof str === 'string';
/**
 * v.2023-09-22
 * Is no typeof string
 */
export const isNotStr = (str: unknown): boolean => !isStr(str);
