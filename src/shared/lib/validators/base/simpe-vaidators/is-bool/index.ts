
export const isBool = (bool: any): boolean => typeof bool === 'boolean';
export const isNotBool = (bool: any): boolean => ! isBool(bool);
