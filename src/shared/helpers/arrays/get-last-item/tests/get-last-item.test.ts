import { getLastItem } from '..';

const ARR = [1, 2, 3, 4, 5, 6, 7];

describe('getLastItem', () => {
  test('Without Shift', () => expect(getLastItem(ARR)).toEqual(7));
  test('Shift = 0', () => expect(getLastItem(ARR, 0)).toEqual(7));
  test('Shift = 1', () => expect(getLastItem(ARR, 1)).toEqual(6));
  test('Shift = 5', () => expect(getLastItem(ARR, 5)).toEqual(2));
  test('Shift is greater than first value = 7', () => expect(getLastItem(ARR, 7)).toEqual(undefined));
  test('ARR is undefined, Without Shift', () => expect(getLastItem(undefined)).toEqual(undefined));
  test('ARR is undefined, Shift = 2', () => expect(getLastItem(undefined, 2)).toEqual(undefined));
  test('ARR is undefined, Shift is greater than first value = 7', () => expect(getLastItem(undefined, 7)).toEqual(undefined));
});

// npm run test:unit get-last-item.test.ts
