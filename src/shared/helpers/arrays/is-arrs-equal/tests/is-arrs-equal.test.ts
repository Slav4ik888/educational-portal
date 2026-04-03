import { isArrsEqual } from '..';
import { mocks } from './mocks';


describe('isArrsEqual', () =>
  mocks.forEach(m =>
    it(m[0].description, () =>
      expect(isArrsEqual(m[0].arr1, m[0].arr2)).toEqual(m[1])
    )
  )
);

// npm run test is-arrs-equal.test.ts
