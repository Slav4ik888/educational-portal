import { mocks } from './mocks';
import { isUndefined, isNotUndefined } from '..';


describe('isUndefined', () => {
  mocks.forEach(m => {
    it(`${String(m[0])} = ${String(m[1])}`, () => {
      expect(isUndefined(m[0])).toEqual(m[1])
    })
  })
});

describe('isNotUndefined', () => {
  mocks.forEach(m => {
    it(`${String(m[0])} = ${String(!m[1])}`, () => {
      expect(isNotUndefined(m[0])).toEqual(!m[1])
    })
  })
});


// npm run test is-undefined.test.ts
