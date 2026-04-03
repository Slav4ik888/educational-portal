import { addOrderToArrByIdx } from '..';



describe('addOrderToArrByIdx', () => {
  it('Возвращает массив с обновлёнными order по возрастанию', () => {
    const mockArrayStart = [
      {
        field1: 'field1',
        field2: 'field2',
        order: '300',
        id: '333',
      },
      {
        field1: 'field1',
        field2: 'field2',
        order: '100',
        id: '111',
      }, {
        field1: 'field1',
        field2: 'field2',
        order: '200',
        id: '222',
      },
    ];

    expect(addOrderToArrByIdx(mockArrayStart)).toEqual([
      {
        field1: 'field1',
        field2: 'field2',
        order: '100',
        id: '333',
      }, {
        field1: 'field1',
        field2: 'field2',
        order: '200',
        id: '111',
      }, {
        field1: 'field1',
        field2: 'field2',
        order: '300',
        id: '222',
      }
    ]);
  });
});


// npm run test:unit add-order-to-arr-by-idx.test.ts
