import { ErrorText } from '../../../errors-texts';
import { validateBoolean } from '..';

describe('validateBoolean', () => {
  // Not required

  test('SomeFieldName is true & not required', () => {
    expect(validateBoolean({ someFieldName: true }, 'someFieldName').errors).toEqual({});
  });

  test('SomeFieldName is false & not required', () => {
    expect(validateBoolean({ someFieldName: false }, 'someFieldName').errors).toEqual({});
  });

  test('User data is undefined & SomeFieldName is not required', () => {
    // @ts-ignore
    expect(validateBoolean(undefined, 'someFieldName').errors).toEqual({});
  });

  test('User data is empty & SomeFieldName is not required', () => {
    expect(validateBoolean({}, 'someFieldName').errors).toEqual({});
  });

  test('SomeFieldName is undefined & not required', () => {
    expect(validateBoolean({ someFieldName: undefined }, 'someFieldName').errors).toEqual({ someFieldName: ErrorText.NOT_BE_UNDEFINED });
  });

  test('SomeFieldName is string & not required', () => {
    expect(validateBoolean({ someFieldName: 'true' as unknown as boolean }, 'someFieldName').errors).toEqual({ someFieldName: ErrorText.INVALID_DATA });
  });

  test('SomeFieldName is {} & not required', () => {
    expect(validateBoolean({ someFieldName: {} as unknown as boolean }, 'someFieldName').errors).toEqual({ someFieldName: ErrorText.INVALID_DATA });
  });

  test('SomeFieldName is [] & not required', () => {
    expect(validateBoolean({ someFieldName: [] as unknown as boolean }, 'someFieldName').errors).toEqual({ someFieldName: ErrorText.INVALID_DATA });
  });

  test('SomeFieldName is null & not required', () => {
    expect(validateBoolean({ someFieldName: null as unknown as boolean }, 'someFieldName').errors).toEqual({ someFieldName: ErrorText.INVALID_DATA });
  });

  // Required

  test('SomeFieldName is true & required', () => {
    expect(validateBoolean({ someFieldName: true }, 'someFieldName', { required: true }).errors).toEqual({});
  });

  test('SomeFieldName is false & required', () => {
    expect(validateBoolean({ someFieldName: false }, 'someFieldName', { required: true }).errors).toEqual({});
  });

  test('User data is undefined & SomeFieldName is required', () => {
    // @ts-ignore
    expect(validateBoolean(undefined, 'someFieldName', { required: true }).errors).toEqual({ someFieldName: ErrorText.REQUIRED });
  });

  test('User data is empty & SomeFieldName is required', () => {
    expect(validateBoolean({}, 'someFieldName', { required: true }).errors).toEqual({ someFieldName: ErrorText.REQUIRED });
  });

  test('SomeFieldName is undefined & required', () => {
    expect(validateBoolean({ someFieldName: undefined }, 'someFieldName', { required: true }).errors).toEqual({ someFieldName: ErrorText.NOT_BE_UNDEFINED });
  });

  test('SomeFieldName is string & required', () => {
    expect(validateBoolean({ someFieldName: 'true' as unknown as boolean }, 'someFieldName', { required: true }).errors).toEqual({ someFieldName: ErrorText.INVALID_DATA });
  });

  test('SomeFieldName is {} & required', () => {
    expect(validateBoolean({ someFieldName: {} as unknown as boolean }, 'someFieldName', { required: true }).errors).toEqual({ someFieldName: ErrorText.INVALID_DATA });
  });

  test('SomeFieldName is [] & required', () => {
    expect(validateBoolean({ someFieldName: [] as unknown as boolean }, 'someFieldName', { required: true }).errors).toEqual({ someFieldName: ErrorText.INVALID_DATA });
  });

  test('SomeFieldName is null & required', () => {
    expect(validateBoolean({ someFieldName: null as unknown as boolean }, 'someFieldName', { required: true }).errors).toEqual({ someFieldName: ErrorText.INVALID_DATA });
  });
});

// npm run test:unit validate-boolean.test.ts
