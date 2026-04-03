/* eslint-disable */
import { updateArrWithItemByField } from '..';
import {
  MOCK_ARR, MOCK_FIELD_UPDATED, MOCK_ARR_UPDATED, MOCK_FIELD_UPDATEDWithoutAnyFields, MOCK_FIELD_NEW_ITEM,
  MOCK_ARRUpdateWithoutAnyFields
} from './mocks';


describe('ARRAY.JS - updateArrWithItemByField', () => {
  it('Обновляем по полю id', () => {
    expect(updateArrWithItemByField([...MOCK_ARR], 'id', MOCK_FIELD_UPDATED)).toEqual(MOCK_ARR_UPDATED);
  });

  it('Обновляем по несуществующему полю => новый item в конец', () => {
    // @ts-ignore
    expect(updateArrWithItemByField([...MOCK_ARR], 'unknown', { unknown: { id: '1' } }))
      .toEqual([
      ...MOCK_ARR,
      { unknown: { id: '1' } }
    ]);
  });

  it('Обновляемый объект undefined', () => {
  // @ts-ignore
    expect(updateArrWithItemByField([...MOCK_ARR], 'id', undefined)).toEqual(MOCK_ARR);
  });

  it('Обновляем несуществующим объектом, он добавляется к массиву', () => {
    expect(updateArrWithItemByField([...MOCK_ARR], 'id', { id: '555' })).toEqual([...MOCK_ARR, { id: '555' }]);
  });

  it('При отсутствии items создаёт пустой массив и добавляет к нему value', () => {
  // @ts-ignore
    expect(updateArrWithItemByField(undefined, 'id', { id: '555' })).toEqual([{ id: '555' }]);
  });

  it('Если стоит flags ["update"], то в обновляемом объекте, обновляются только те поля что переданы, остальные имеющиеся остаются без изменений', () => {
    expect(updateArrWithItemByField([...MOCK_ARR], 'id', MOCK_FIELD_UPDATEDWithoutAnyFields, 'update')).toEqual(MOCK_ARRUpdateWithoutAnyFields);
  });

  it('Стоит flags ["after"], этот item есть - обновляется', () => {
    expect(updateArrWithItemByField([...MOCK_ARR], 'id', MOCK_FIELD_UPDATED, ['after', '333']))
      .toEqual(MOCK_ARR_UPDATED);
  });

  it('Стоит flags ["after"], item новый, after есть - добавляется после него', () => {
    expect(updateArrWithItemByField([...MOCK_ARR], 'id', MOCK_FIELD_NEW_ITEM, ['after', '111']))
      .toEqual([{
        field1 : 'field1',
        field2 : 'field2',
        id     : '111'
      },
      MOCK_FIELD_NEW_ITEM,
      {
        field1: 'field1',
        field2: 'field2',
        id     : '222'
      }, {
        field1: 'field1',
        field2: 'field2',
        id     : '333'
      }]);
  });

  it('Стоит flags ["after"], item новый, after неверный - добавляется в конец', () => {
    expect(updateArrWithItemByField([...MOCK_ARR], 'id', MOCK_FIELD_NEW_ITEM, ['after', '777']))
      .toEqual([...MOCK_ARR, MOCK_FIELD_NEW_ITEM]);
  });
});


// npm run test:unit update-arr-with-item-by-field.test.ts
