import { isFieldValueBool } from '..';


describe('isFieldValueBool', () => {
  test('Field value is boolean - true', () => {
    expect(isFieldValueBool({ data: true }, 'data')).toEqual(true);
  });

  test('Field value is boolean - false', () => {
    expect(isFieldValueBool({ data: false }, 'data')).toEqual(true);
  });

  test('Data is empty', () => {
    expect(isFieldValueBool({}, 'data')).toEqual(false);
  });

  test('Data is undefined', () => {
    // @ts-ignore
    expect(isFieldValueBool(undefined, 'data')).toEqual(false);
  });

  test('Field value is number', () => {
    expect(isFieldValueBool({ data: 123 }, 'data')).toEqual(false);
  });

  test('Field value is null', () => {
    expect(isFieldValueBool({ data: null }, 'data')).toEqual(false);
  });
});

// npm run test:unit is-field-value-bool.test.ts
