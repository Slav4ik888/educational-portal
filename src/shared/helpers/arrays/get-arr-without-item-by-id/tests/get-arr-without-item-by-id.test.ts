import { getArrWithoutItemById } from '..';
import { MOCKS } from './mocks';


describe('ARRAY.JS - getArrWithoutItemById', () => {
  MOCKS.forEach(m =>
    it(m[0].description, () =>
      expect(getArrWithoutItemById(m[0].items, m[0].value)).toEqual(m[1])
    )
  );
});

// npm run test:unit get-arr-without-item-by-id.test.ts
