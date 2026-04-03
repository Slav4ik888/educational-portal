import { getArrContainValueByField } from '..'
import { mocks } from './mocks'

describe('getArrContainValueByField', () => {
  mocks.forEach(m =>
    it(m[0].description, () => {
      expect(getArrContainValueByField(m[0].arr, m[0].field, m[0].regexp)).toEqual(m[1])
    })
  )
});

// npm run test get-arr-contain-value-by-field.test.ts
