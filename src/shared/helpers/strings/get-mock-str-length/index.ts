
const strLength = (n: number, char: string): string => [...new Array(n)]
  .map(_ => char)
  .join('')


export const getMockStrLength = (n: number, char?: string): string => {
  let c = '_';

  if (char && typeof char === 'string') c = char.charAt(0);

  return strLength(n, c);
}
