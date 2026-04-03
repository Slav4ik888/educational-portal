import { Config, getFixedFraction } from '..';


describe('getFixedFraction', () => {
  test('undefined f8 => 0', () => expect(
    getFixedFraction(undefined as unknown as number, { fractionDigits: 8 })
  ).toEqual(''));

  test('0 f undefined => 12', () => expect(
    getFixedFraction(0, undefined as unknown as Config)
  ).toEqual('0'));

  test('12,1234567 f undefined => 12', () => expect(
    getFixedFraction(12.1234567, undefined as unknown as Config)
  ).toEqual('12'));

  test('12,1234567 f3 => 12,123', () => expect(
    getFixedFraction(12.1234567, { fractionDigits: 3 })
  ).toEqual('12.123'));

  test('12,1234567 f7 => 12,1234567', () => expect(
    getFixedFraction(12.1234567, { fractionDigits: 7 })
  ).toEqual('12.1234567'));

  test('12,1234567 f8 => 12,1234567', () => expect(
    getFixedFraction(12.1234567, { fractionDigits: 8 })
  ).toEqual('12.1234567'));

  test('12 f8 => 12', () => expect(
    getFixedFraction(12, { fractionDigits: 8 })
  ).toEqual('12'));

  // addZero
  test('12,1234567 f3 withZero => 12,123', () => expect(
    getFixedFraction(12.1234567, { fractionDigits: 3, addZero: true })
  ).toEqual('12.123'));

  test('12,12 f3 withZero => 12,120', () => expect(
    getFixedFraction(12.12, { fractionDigits: 3, addZero: true })
  ).toEqual('12.120'));

  test('12 f3 withZero => 12,000', () => expect(
    getFixedFraction(12, { fractionDigits: 3, addZero: true })
  ).toEqual('12.000'));

  test('1.036 f3 withZero => 12,000', () => expect(
    getFixedFraction(1.03623, { fractionDigits: 3, addZero: true })
  ).toEqual('1.036'));

  test('1.036 f3 withZero => 12,000', () => expect(
    getFixedFraction(1.03623, { fractionDigits: 2, addZero: true })
  ).toEqual('1.04'));


  test('-10431951.3 f3 withZero => 12,000', () => expect(
    getFixedFraction(-10431951.3, { fractionDigits: 3, addZero: true })
  ).toEqual('-10431951.300'));
});

// npm run test:unit get-fixed-fraction.test.ts
