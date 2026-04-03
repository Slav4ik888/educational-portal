
export const isMoreThan = (str: string, max: number) => str?.length > max;
export const isNotMoreThan = (str: string, max: number) => ! isMoreThan(str, max);
