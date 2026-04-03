import { getCircularValue } from '..';


describe('getCircularValue', () => {
  const TEMPLATE_COLORS = [
    'rgb(30, 160, 16)',
    'rgb(255, 99, 132)',
    'rgb(54, 162, 235)',
    'rgb(255, 205, 86)',
    'rgb(162, 12, 150)',
    'rgb(202, 90, 21)',
  ];

  test('arr is undefined', () => {
    // @ts-ignore
    expect(getCircularValue(undefined, 1)).toEqual(undefined);
  });
  test('arr is empty', () => {
    expect(getCircularValue([], 10)).toEqual(undefined);
  });
  test('get 1 elem', () => {
    expect(getCircularValue(TEMPLATE_COLORS, 0)).toEqual('rgb(30, 160, 16)');
  });
  test('get last elem', () => {
    expect(getCircularValue(TEMPLATE_COLORS, 5)).toEqual('rgb(202, 90, 21)');
  });
  test('get 2 elem  by circular', () => {
    expect(getCircularValue(TEMPLATE_COLORS, 7)).toEqual('rgb(255, 99, 132)');
  });
});

// npm run test:unit get-circular-value.test.ts
