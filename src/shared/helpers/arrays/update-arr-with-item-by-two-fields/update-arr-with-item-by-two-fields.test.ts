import { updateArrWithItemByTwoFields } from '.';
import * as m from './mocks';


describe('ARRAY.JS - updateArrWithItemByTwoFields', () => {
  it('Обновляем по полю id', () => {
    expect(updateArrWithItemByTwoFields([...m.mockArray], 'field1', 'field2', m.mockFieldUpdate)).toEqual(m.mockArrayUpdated);
  });

  it('Обновляем несуществующим объектом, он добавляется к массиву', () => {
    expect(updateArrWithItemByTwoFields([...m.mockArray], 'field1', 'field2', m.mockFieldAdd)).toEqual(m.mockArrayAdded);
  });
});


// npm run test update-arr-with-item-by-two-fields.test.js
