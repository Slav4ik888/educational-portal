import { getReducedWithReduction } from '..';


describe('getReducedWithReduction', () => {
  // invalid input
  test('undefined', () => expect(getReducedWithReduction(undefined)).toEqual({ value: undefined, reduction: '' }));

  // without changes
  test('0', () => expect(getReducedWithReduction(0)).toEqual({ value: 0, reduction: '' }));
  test('1', () => expect(getReducedWithReduction(1)).toEqual({ value: 1, reduction: '' }));
  test('999', () => expect(getReducedWithReduction(999)).toEqual({ value: 999, reduction: '' }));
  test('-999', () => expect(getReducedWithReduction(-999)).toEqual({ value: -999, reduction: '' }));

  // changed
  test('999', () => expect(getReducedWithReduction(999)).toEqual({ value: 999, reduction: '' }));
  test('1999', () => expect(getReducedWithReduction(1999)).toEqual({ value: 1.999, reduction: 'тыс' }));
  test('111222', () => expect(getReducedWithReduction(111222)).toEqual({ value: 111.222, reduction: 'тыс' }));
  test('1222333', () => expect(getReducedWithReduction(1222333)).toEqual({ value: 1.222333, reduction: 'млн' }));
  test('111222333', () => expect(getReducedWithReduction(111222333)).toEqual({ value: 111.222333, reduction: 'млн' }));
  test('-111222333444', () => expect(getReducedWithReduction(-111222333444)).toEqual({ value: -111.222333444, reduction: 'млрд' }));
  test('-111222333444555', () => expect(getReducedWithReduction(-111222333444555)).toEqual({ value: -111.222333444555, reduction: 'трлн' }));
  // eslint-disable-next-line
  test('111222333444555666', () => expect(getReducedWithReduction(111222333444555666)).toEqual({ value: 111222.333444555666, reduction: 'трлн' }));

  // 'трлн' 'млрд' 'млн' 'тыс'
});

// npm run test:unit get-reduced-with-reduction.test.ts
