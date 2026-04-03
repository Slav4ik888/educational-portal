
export function isUndefined<T>(obj: T): boolean { return typeof obj === 'undefined'; }
export function isNotUndefined<T>(obj: T): boolean { return ! isUndefined(obj); }
