import { getValidResultByKeywords } from '..';
import { mocks } from './mocks';


describe('getValidResultByKeywords', () => {
  mocks.forEach(m => {
    it(m[0].description, () => {
      expect(getValidResultByKeywords(m[0].validate)).toEqual(m[1])
    })
  })
});

// npm run test:unit get-valid-result-by-keywords.test.ts
