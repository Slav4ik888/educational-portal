import { getMockStrLength } from 'shared/helpers/strings';
import { isRequiredLength } from '..';


describe('isRequiredLength', () => {
  test('Str === mustLength', () => {
    expect(isRequiredLength(getMockStrLength(10), 10)).toEqual(true);
  });

  test('Str is undefined', () => {
    // @ts-ignore
    expect(isRequiredLength(undefined, 10)).toEqual(false);
  });

  test('mustLength is undefined', () => {
    // @ts-ignore
    expect(isRequiredLength('111', undefined)).toEqual(false);
  });

  test('Str & mustLength is undefined', () => {
    // @ts-ignore
    expect(isRequiredLength(undefined, undefined)).toEqual(false);
  });


  test('Str < mustLength', () => {
    expect(isRequiredLength(getMockStrLength(9), 10)).toEqual(false);
  });

  test('Str > mustLength', () => {
    expect(isRequiredLength(getMockStrLength(11), 10)).toEqual(false);
  });
});

// npm run test:unit is-required-length.test.ts
