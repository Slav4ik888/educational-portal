import { getFirstFieldKey } from '..';
import { mocks } from './mocks';


describe('getFirstFieldKey', () => {
  mocks.forEach((m, i) => {
    it(m[0].description, () => {
      expect(getFirstFieldKey(m[0].obj))
        .toEqual(m[1])
    })
  })
})

// npm run test get-first-field-key.test.ts
