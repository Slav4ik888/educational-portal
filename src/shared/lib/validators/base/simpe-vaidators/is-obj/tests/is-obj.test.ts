import { mocks } from './mocks';
import { isObj, isNotObj } from '..';


describe('isObj', () => {
  mocks.forEach(m => {
    it(`${String(m[0])} = ${String(m[1])}`, () => {
      expect(isObj(m[0])).toEqual(m[1])
    })
  })
});

describe('isNotObj', () => {
  mocks.forEach(m => {
    it(`${String(m[0])} = ${String(!m[1])}`, () => {
      expect(isNotObj(m[0])).toEqual(!m[1])
    })
  })
});

// npm run test is-obj.test.ts
