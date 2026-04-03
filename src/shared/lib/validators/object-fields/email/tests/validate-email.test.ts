import { mocks } from './mocks';
import { validateEmail } from '..';


describe('validateEmail', () => {
  mocks.forEach(m => {
    it(m[0].description, () => {
      expect(validateEmail(m[0].data, m[0].required)).toEqual(m[1])
    })
  })
});


// npm run test:unit validate-email.test.ts
