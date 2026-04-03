import { mocks } from './mocks';
import { isValidMaxL } from '..';


describe('isValidMaxL', () => {
  mocks.forEach(m => {
    it(m[0].description, () => {
      expect(isValidMaxL(m[0].maxLength, m[0].str)).toEqual(m[1])
    })
  })
});


// npm run test is-valid-max-l.test.ts
