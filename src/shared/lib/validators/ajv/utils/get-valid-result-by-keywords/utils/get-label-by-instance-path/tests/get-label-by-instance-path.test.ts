import { getLabelByInstancePath } from '..';
import { mocks } from './mocks';


describe('getLabelByInstancePath', () => {
  mocks.forEach(m => {
    it(m[0].description, () => {
      expect(getLabelByInstancePath(m[0].err)).toEqual(m[1])
    })
  })
});

// npm run test:unit get-label-by-instance-path.test.ts
