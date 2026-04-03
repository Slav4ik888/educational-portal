import { addZeroToRest } from '..';


describe('addZeroToRest', () => {
  test('undefined, undefined', () => expect(addZeroToRest(undefined, undefined)).toEqual(''));
  test('NaN, NaN', () => expect(addZeroToRest(NaN, NaN)).toEqual(''));
  test('0, 0', () => expect(addZeroToRest(0, 0)).toEqual('0'));
  test('0, 10', () => expect(addZeroToRest(0, 10)).toEqual('0.0000000000'));


  test('123 zero 5', () => expect(addZeroToRest(123, 5)).toEqual('123.00000'));
  test('123.456 zero 5', () => expect(addZeroToRest(123.456, 5)).toEqual('123.45600'));
  test('.456 zero 5', () => expect(addZeroToRest(0.456, 5)).toEqual('0.45600'));

  test('9.5 zero 1', () => expect(addZeroToRest(9.5, 1)).toEqual('9.5'));
  test('-10431951.3 zero 3', () => expect(addZeroToRest(-10431951.3, 3)).toEqual('-10431951.300'));
});

// npm run test:unit add-zero-to-rest.test.ts
