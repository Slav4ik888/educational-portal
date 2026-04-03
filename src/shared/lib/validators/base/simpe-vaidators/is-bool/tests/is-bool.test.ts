import { mocks } from './mocks';
import { isBool, isNotBool } from '..';


describe('isBool', () => {
  mocks.forEach(m => {
    it(`${String(m[0])} = ${String(m[1])}`, () => {
      expect(isBool(m[0])).toEqual(m[1])
    })
  })
});

describe('isNotBool', () => {
  mocks.forEach(m => {
    it(`${String(m[0])} = ${String(!m[1])}`, () => {
      expect(isNotBool(m[0])).toEqual(!m[1])
    })
  })
});


// npm run test is-bool.test.ts
