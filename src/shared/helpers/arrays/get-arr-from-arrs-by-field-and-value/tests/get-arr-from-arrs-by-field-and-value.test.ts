import { getArrFromArrsByFieldAndValue } from '..';
import { mocks } from './mocks';


describe('getArrFromArrsByFieldAndValue', () => {
  mocks.forEach(m => it(m[0].description, () => {
    expect(getArrFromArrsByFieldAndValue(m[0].arr, m[0].fieldArr, m[0].value))
      .toEqual(m[1])
  }));
});

// npm run test get-arr-from-arrs-by-field-and-value.test.ts
