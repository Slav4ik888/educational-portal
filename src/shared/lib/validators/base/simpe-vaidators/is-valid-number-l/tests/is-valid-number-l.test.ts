import { mocks } from './mocks';
import { isValidNumberL } from '..';


describe('isValidNumberL', () => {
  mocks.forEach(m => {
    it(m[0].description, () => {
      expect(isValidNumberL(m[0].length, m[0].strNum)).toEqual(m[1])
    })
  })
});


// npm run test is-valid-number-l.test.ts
