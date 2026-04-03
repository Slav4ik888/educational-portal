import { getValueIfNotUndefined } from '..';
import { mocks } from './mocks';


describe('getValueIfNotUndefined', () => {
  mocks.forEach((m, i) => {
    it(m[0].description, () => {
      expect(getValueIfNotUndefined(m[0].field, m[0].wrapper))
        .toEqual(m[1])
    })
  })
})

  // npm run test:unit get-value-if-not-undefined.test.ts
