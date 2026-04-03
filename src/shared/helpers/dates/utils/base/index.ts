export const sec      = (n: number): number => n * 1000;
export const min      = (n: number): number => n * sec(60);
export const hour     = (n: number = 1): number => n * min(60);

export const day      = (n: number): number => n * hour(24);
export const oneDay   = day(1);

export const week     = (n: number): number => n * day(7);

export const month    = (n: number): number => n * day(30);
export const oneMonth = month(1);
