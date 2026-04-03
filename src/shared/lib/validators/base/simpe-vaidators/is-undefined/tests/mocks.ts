import { Mocks } from './types';

export const mocks: Mocks = [
  [undefined, true],
  [true,      false],
  [false,     false],
  ['message', false],
  ['',        false],
  [123,       false],
  [null,      false],
  [[],        false],
  [{},        false]
]
