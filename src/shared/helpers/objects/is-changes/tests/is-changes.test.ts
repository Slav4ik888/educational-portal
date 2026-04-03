import { isChanges } from '..'
import { Mocks } from './types'

const mocks: Mocks = [
  [{ prevObj: {},        newObj: {} },        false],
  [{ prevObj: undefined, newObj: undefined }, false],
  [{ prevObj: undefined, newObj: {} },        true],
  [{ prevObj: { id: 1 }, newObj: {} },        true],

  [{ prevObj: { id: 1, obj: { f: { str: '1' } } }, newObj: { id: 1, obj: { f: { str: '1' } } } },  false],
  [{ prevObj: { id: 1, obj: { f: { str: '1' } } }, newObj: { id: 1, obj: { f: { str: '11' } } } }, true],
];


describe('isChanges', () => {
  mocks.forEach((m, i) => it(`${i}`, () => expect(
    isChanges(m[0].prevObj, m[0].newObj))
    .toEqual(m[1])
  ))
});

// npm run test:unit is-changes.test.ts
