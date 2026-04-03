import { mocks } from './mocks';
import { isNum, isNotNum } from '..';


describe('isNum', () => {
  mocks.forEach(m => {
    it(`${String(m[0])} = ${String(m[1])}`, () => {
      expect(isNum(m[0])).toEqual(m[1])
    })
  })
});

describe('isNotNum', () => {
  mocks.forEach(m => {
    it(`${String(m[0])} = ${String(!m[1])}`, () => {
      expect(isNotNum(m[0])).toEqual(!m[1])
    })
  })
});

// npm run test is-num.test.ts
