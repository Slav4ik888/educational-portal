import { getArrWithoutItemByTwoFields } from '.';
import * as m from './mocks';


describe('ARRAY.JS - getArrWithoutItemByTwoFields', () => {
  it('Обновляем по полю id', () => {
    expect(getArrWithoutItemByTwoFields([...m.mockArray], 'field1', 'field2', m.mockFieldTrue))
      .toEqual(m.mockArrayWithoutItem);
  });

  it('Обновляем несуществующим объектом, он добавляется к массиву', () => {
    expect(getArrWithoutItemByTwoFields([...m.mockArray], 'field1', 'field2', m.mockFieldFalse))
      .toEqual(m.mockArray);
  });
});


// npm run test get-arr-without-item-by-two-fields.test.js
