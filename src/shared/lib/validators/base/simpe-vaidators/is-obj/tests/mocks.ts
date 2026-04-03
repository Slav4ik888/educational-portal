import { Mocks } from './types';

export const mocks: Mocks = [
  [{},              true],
  [{ a: 1, b: [] }, true],
  // @ts-ignore
  [undefined,       false],
  // @ts-ignore
  [null,            false],
  [NaN   as unknown as object, false],
  [0     as unknown as object, false],
  [123   as unknown as object, false],
  ['123' as unknown as object, false],
  [[]    as unknown as object, false],
  [[1]   as unknown as object, false]
]
