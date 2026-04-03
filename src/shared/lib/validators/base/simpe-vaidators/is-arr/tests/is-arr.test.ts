import { mocks } from './mocks';
import { isArr, isNotArr } from '..';


describe('isArr', () => {
  mocks.forEach(m => {
    it(`${String(m[0])} = ${String(m[1])}`, () => {
      expect(isArr(m[0])).toEqual(m[1])
    })
  })
});

describe('isNotArr', () => {
  mocks.forEach(m => {
    it(`${String(m[0])} = ${String(!m[1])}`, () => {
      expect(isNotArr(m[0])).toEqual(!m[1])
    })
  })
});

// npm run test:unit is-arr.test.ts
