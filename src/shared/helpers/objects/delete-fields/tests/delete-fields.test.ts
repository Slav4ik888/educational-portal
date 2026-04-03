import { deleteFields } from '..';



describe('deleteFields', () => {
  test('valid fields', () => {
    const obj = {
      field1: 'field1 value',
      field2: 'field2 value',
      field3: 'field3 value',
      field4: 'field4 value',
      field5: 'field5 value',
    };

    deleteFields(obj, ['field2', 'field4', 'field5']);

    expect(obj).toEqual({ field1: 'field1 value', field3: 'field3 value' });
  });


  test('valid fields & 2 одинаковых fields', () => {
    const obj = {
      field1: 'field1 value',
      field2: 'field2 value',
      field3: 'field3 value',
      field4: 'field4 value',
      field5: 'field5 value',
    };

    deleteFields(obj, ['field2', 'field2', 'field4', 'field5']);

    expect(obj).toEqual({ field1: 'field1 value', field3: 'field3 value' });
  });


  test('field is apsent', () => {
    const obj = {
      field1: 'field1 value',
      field2: 'field2 value',
      field3: 'field3 value',
      field4: 'field4 value',
      field5: 'field5 value',
    };

    // @ts-ignore
    deleteFields(obj, ['noField']);

    expect(obj).toEqual({
      field1: 'field1 value',
      field2: 'field2 value',
      field3: 'field3 value',
      field4: 'field4 value',
      field5: 'field5 value',
    });
  });


  test('object is undefined', () => {
    // @ts-ignore
    deleteFields(undefined, ['']);

    expect(undefined).toEqual(undefined);
  });

  test('array is invalid', () => {
    const obj = {
      field1: 'field1 value',
      field2: 'field2 value',
      field3: 'field3 value',
      field4: 'field4 value',
      field5: 'field5 value',
    };

    // @ts-ignore
    deleteFields(obj, '');

    expect(obj).toEqual(obj);
  });
});

// npm run test:unit delete-fields.test.ts
