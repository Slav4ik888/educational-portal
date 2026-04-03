import { showIfNotUndefined } from '..';
import { mocks } from './mocks';


describe('showIfNotUndefined', () => {
  mocks.forEach((m, i) => {
    it(m[0].description, () => {
      expect(showIfNotUndefined(m[0].field, m[0].wrapper))
        .toEqual(m[1])
    })
  })
})

  // npm run test:unit show-if-not-undefined.test.ts
