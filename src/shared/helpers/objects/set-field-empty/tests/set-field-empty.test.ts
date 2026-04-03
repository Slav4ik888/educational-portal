import { setFieldEmpty } from '..';


describe('setFieldEmpty', () => {
  test('obj is undefined', () => {
    const obj = undefined;

    // @ts-ignore
    setFieldEmpty(obj, 'field1')
    expect(obj).toEqual(obj);
  });

  test('obj is not object', () => {
    const obj = ['1'];

    // @ts-ignore
    setFieldEmpty(obj, 'field1');
    expect(obj).toEqual(obj);
  });

  test('valid data, field is undefined', () => {
    const obj = {
      a: 1
    };

    // @ts-ignore
    setFieldEmpty(obj, 'field1');
    expect(obj).toEqual({
      a: 1
    });
  });

  test('valid data, field is present', () => {
    const obj = {
      a: 1,
      field1: { any: 2 }
    };

    setFieldEmpty(obj, 'field1')
    expect(obj).toEqual({
      a: 1,
      field1: ''
    });
  });
});

// npm run test:unit set-field-empty.test.ts
