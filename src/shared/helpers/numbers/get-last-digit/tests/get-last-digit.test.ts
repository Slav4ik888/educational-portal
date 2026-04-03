import { getLastDigit } from '..';


describe('getLastDigit', () => {
  test('Number is undefined', () => {
  // @ts-ignore
    expect(getLastDigit(undefined)).toEqual(undefined);
  });
  test('Number is NaN', () => {
    expect(getLastDigit(NaN)).toEqual(NaN);
  });
  test('Number is `text`', () => {
    expect(getLastDigit('text' as unknown as number)).toEqual('text');
  });
  test('Number is boolean - true', () => {
    expect(getLastDigit(true as unknown as number)).toEqual(true);
  });
  test('Number is boolean - false', () => {
    expect(getLastDigit(false as unknown as number)).toEqual(false);
  });

  test('Number is 0', () => {
    expect(getLastDigit(0)).toEqual(0);
  });
  test('Number is 1', () => {
    expect(getLastDigit(1)).toEqual(1);
  });
  test('Number is 10', () => {
    expect(getLastDigit(10)).toEqual(0);
  });
  test('Number is 1000', () => {
    expect(getLastDigit(1000)).toEqual(0);
  });

  test('Number is 3', () => {
    expect(getLastDigit(3)).toEqual(3);
  });
  test('Number is 13', () => {
    expect(getLastDigit(13)).toEqual(3);
  });
  test('Number is 123', () => {
    expect(getLastDigit(123)).toEqual(3);
  });

  test('Number is 123456789', () => {
    expect(getLastDigit(123456789)).toEqual(9);
  });

  // needTwoDigit
  test('Number is 123456789 & needTwoDigit', () => {
    expect(getLastDigit(9, true)).toEqual(9);
  });
  test('Number is 123456789 & needTwoDigit', () => {
    expect(getLastDigit(123456789, true)).toEqual(89);
  });
});

// npm run test:unit get-last-digit.test.ts
