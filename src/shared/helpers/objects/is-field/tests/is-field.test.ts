import { isField } from '..';


describe('isField', () => {
  // OBJ
  test('Empty obj', () => {
    expect(isField({}, 'some field')).toEqual(false);
  });
  test('Obj is undefined', () => {
    expect(isField(undefined, 'some field')).toEqual(false);
  });
  test('Valid is true', () => {
    expect(isField({ someField: '123' }, 'someField')).toEqual(true);
  });
  test('Valid is false', () => {
    expect(isField({ someField: '123' }, 'field')).toEqual(false);
  });

  // FIELD
  test('Field is undefined', () => {
    expect(isField({ someField: '123' }, undefined as unknown as string)).toEqual(false);
  });
  test('Field is not string', () => {
    expect(isField({ someField: '123' }, 123 as unknown as string)).toEqual(false);
  });
});


// npm run test:unit is-field.test.ts
