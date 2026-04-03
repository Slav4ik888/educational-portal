import { getItemFromArrByTwoField } from '..'
import { mocks } from './mocks';



describe('getItemFromArrByTwoField', () => {
  mocks.forEach((m, i) => it(`${i + 1}`, () => expect(
    getItemFromArrByTwoField(m[0].arr, m[0].ff, m[0].vf, m[0].fs, m[0].vs))
    .toEqual(m[1])))
});

// npm run test get-item-from-arr-by-two-field.test.ts
