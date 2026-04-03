
export const isLessThan = (str: string, min: number) => str?.length < min;
export const isNotLessThan = (str: string, min: number) => ! isLessThan(str, min);
