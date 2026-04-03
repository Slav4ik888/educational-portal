import { createArr } from '..';


describe('createArr', () => {
  test('Without item', () => {
    expect(createArr(3)).toEqual(['-', '-', '-']);
  });

  test('Item { a: "1" }', () => {
    expect(createArr(3, { a: '1' })).toEqual([{ a: '1' }, { a: '1' }, { a: '1' }]);
  });

  test('Item "1"', () => {
    expect(createArr(3, '1')).toEqual(['1', '1', '1']);
  });
});

// npm run test:unit create-arr.test.ts
