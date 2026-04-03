import { isFieldValueUndefined } from '..';


describe('isFieldValueUndefined', () => {
  test('Field value is undefined', () => {
    expect(isFieldValueUndefined({ data: undefined }, 'data')).toEqual(true);
  });

  test('Data is empty', () => {
    expect(isFieldValueUndefined({}, 'data')).toEqual(false);
  });

  test('Data is undefined', () => {
    // @ts-ignore
    expect(isFieldValueUndefined(undefined, 'data')).toEqual(false);
  });

  test('Field value is not undefined', () => {
    expect(isFieldValueUndefined({ data: 123 }, 'data')).toEqual(false);
  });
});

// npm run test:unit is-field-value-undefined.test.ts
