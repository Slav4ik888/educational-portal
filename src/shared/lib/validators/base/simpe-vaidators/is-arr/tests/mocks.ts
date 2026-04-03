import { Mocks } from './types';

export const mocks: Mocks = [
  [[],                true],
  [[1, 2, 3],         true],
  [[{ a: 1 }, [], 3], true],

  // @ts-ignore
  [undefined,   false],
  // @ts-ignore
  [null,        false],
  [123      as unknown as unknown[], false],
  ['123'    as unknown as unknown[], false],
  [{}       as unknown as unknown[], false],
  [{ a: 1 } as unknown as unknown[], false]
]
