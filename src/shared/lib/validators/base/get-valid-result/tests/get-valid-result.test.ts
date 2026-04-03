import { mocks } from './mocks';
import { getValidResult } from '..';


describe('getValidResult', () => {
  mocks.forEach((m, i) => {
    it(m[0].description, () => {
      expect(getValidResult(m[0].data)).toEqual(m[1])
    })
  })
})

// npm run test get-valid-result.test.ts
