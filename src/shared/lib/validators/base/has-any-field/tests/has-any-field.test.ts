import { hasAnyField } from '..';
import { objWithManyAnyFields, objWithOneAnyField, objWithoutSomeFields, schema } from './mocks'

describe('hasAnyField', () => {
  test('Object is undefined', () => {
  // @ts-ignore
    expect(hasAnyField(undefined, schema)).toEqual(false);
  });

  test('Schema is undefined', () => {
  // @ts-ignore
    expect(hasAnyField(schema, undefined)).toEqual(false);
  });

  test('Valid object', () => {
    expect(hasAnyField(schema, schema)).toEqual(false);
  });

  test('Object without some fields', () => {
    expect(hasAnyField(objWithoutSomeFields, schema)).toEqual(false);
  });

  test('Object with one any field', () => {
    expect(hasAnyField(objWithOneAnyField, schema)).toEqual(true);
  });

  test('Object with many any fields', () => {
    expect(hasAnyField(objWithManyAnyFields, schema)).toEqual(true);
  });
});

// npm run test:unit has-any-field.test.ts
