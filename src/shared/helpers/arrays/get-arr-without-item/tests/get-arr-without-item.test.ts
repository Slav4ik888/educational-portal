import { getArrWithoutItem } from '..';
import { MOCKS_OF_OBJ } from './obj-mocks';
import { MOCKS_OF_SIMPLE } from './simple-mocks';


describe('ARRAY.JS - getArrWithoutItem SIMPLE', () => {
  MOCKS_OF_SIMPLE.forEach(m =>
    it(m[0].description, () =>
      expect(getArrWithoutItem(m[0].items, m[0].value)).toEqual(m[1])
    )
  );
});


describe('ARRAY.JS - getArrWithoutItem OBJ', () => {
  MOCKS_OF_OBJ.forEach(m =>
    it(m[0].description, () =>
      expect(getArrWithoutItem(m[0].items, m[0].value, m[0].field)).toEqual(m[1])
    )
  );
});

// npm run test:unit get-arr-without-item.test.ts
