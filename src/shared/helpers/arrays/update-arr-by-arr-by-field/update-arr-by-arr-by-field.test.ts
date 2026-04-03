import { updateArrByArrByField } from '.';
import mocks from './mocks';


describe('updateArrByArrByField', () => {
  mocks.forEach(m => {
    it('Case', () => {
      expect(updateArrByArrByField(m.lastArr, 'id', m.newArr))
        .toEqual(m.result)
    })
  })
});

// npm run test:unit update-arr-by-arr-by-field.test.ts
