import { isHasField } from '..';


describe('isHasField', () => {
  test('Data has the field, value is undefined', () => {
    expect(isHasField({ data: undefined }, 'data')).toEqual(true);
  });

  test('Data has the field, value is number', () => {
    expect(isHasField({ data: 123 }, 'data')).toEqual(true);
  });

  test('Data has the field, value is false', () => {
    expect(isHasField({ data: false }, 'data')).toEqual(true);
  });

  test('Data is empty', () => {
    expect(isHasField({}, 'data')).toEqual(false);
  });

  test('Data is undefined', () => {
    // @ts-ignore
    expect(isHasField(undefined, 'data')).toEqual(false);
  });
});

// npm run test:unit has-field.test.ts
