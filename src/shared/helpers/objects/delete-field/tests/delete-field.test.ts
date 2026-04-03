import { deleteField } from '..';



describe('deleteField', () => {
  test('valid field', () => {
    const obj = {
      some     : 'field',
      anyField : 'value',
    };

    deleteField(obj, 'anyField');

    expect(obj).toEqual({ some: 'field' });
  });

  test('field is apsent', () => {
    const obj = {
      some     : 'field',
      anyField : 'value',
    };

    // @ts-ignore
    deleteField(obj, 'noField');

    expect(obj).toEqual({ some: 'field', anyField: 'value' });
  });

  test('object is undefined', () => {
    // @ts-ignore
    deleteField(undefined, '');

    expect(undefined).toEqual(undefined);
  });
});

// npm run test:unit delete-field.test.ts
