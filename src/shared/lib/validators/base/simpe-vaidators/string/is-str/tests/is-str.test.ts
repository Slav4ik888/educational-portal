import { mocks } from './mocks';
import { isStr, isNotStr } from '..';


describe('isStr', () => {
  mocks.forEach(m => {
    it(`${String(m[0])} = ${String(m[1])}`, () => {
      expect(isStr(m[0])).toEqual(m[1])
    })
  })
});

describe('isNotStr', () => {
  mocks.forEach(m => {
    it(`${String(m[0])} = ${String(!m[1])}`, () => {
      expect(isNotStr(m[0])).toEqual(!m[1])
    })
  })
});

// npm run test is-str.test.ts
