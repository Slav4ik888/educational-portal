import { getArrWithoutItems } from '..';
import { MOCKS } from './mocks';


describe('ARRAY.JS - getArrWithoutItems', () => {
  MOCKS.forEach(m =>
    it(m[0].description, () =>
      expect(getArrWithoutItems(m[0].arr, m[0].field, m[0].values)).toEqual(m[1])
    )
  );
});

// npm run test get-arr-without-items.test.ts
