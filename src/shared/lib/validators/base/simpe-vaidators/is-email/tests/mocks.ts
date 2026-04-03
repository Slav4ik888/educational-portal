import { Mocks } from './types';

export const mocks: Mocks = [
  ['korzan.va@mail.ru', true],
  ['korzan@va@mail.ru', false],
  ['korzan.va@mail.',   false],
  ['korzan.va@mail',    false],
  ['korzan.va@',        false],
  ['',                  false],
  [123 as unknown as string, false],
  // @ts-ignore
  [undefined,           false],
  // @ts-ignore
  [null,                false]
]
