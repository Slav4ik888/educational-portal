import { ErrorText } from '../../../errors-texts';
import { validateString } from '..';
import { getMockStrLength } from 'shared/helpers/strings';
import { ContainsField } from '../../types';


describe('validateString', () => {
  // Not required

  test('Valid string', () => {
    expect(validateString({ someFieldName: getMockStrLength(30) }, 'someFieldName').errors).toEqual({});
  });

  test('Valid string, with length', () => {
    expect(validateString({ someFieldName: getMockStrLength(30) }, 'someFieldName', { length: 30 }).errors).toEqual({});
  });

  test('Empty string, with length', () => {
    expect(validateString({ someFieldName: '' }, 'someFieldName', { length: 30 }).errors).toEqual({});
  });

  test('Valid string, with min', () => {
    expect(validateString({ someFieldName: getMockStrLength(30) }, 'someFieldName', { min: 30 }).errors).toEqual({});
  });

  test('Valid string, with max', () => {
    expect(validateString({ someFieldName: getMockStrLength(30) }, 'someFieldName', { min: 30 }).errors).toEqual({});
  });

  test('Valid string, with min max', () => {
    expect(validateString({ someFieldName: getMockStrLength(30) }, 'someFieldName', { min: 30, max: 30 }).errors).toEqual({});
  });

  test('Valid string, with min max', () => {
    expect(validateString({ someFieldName: getMockStrLength(30) }, 'someFieldName', { min: 29, max: 31 }).errors).toEqual({});
  });

  test('String less min', () => {
    expect(validateString({ someFieldName: getMockStrLength(28) }, 'someFieldName', { min: 29, max: 31 }).errors)
      .toEqual({ someFieldName: ErrorText.STR_LESS_THAN });
  });

  test('String more max', () => {
    expect(validateString({ someFieldName: getMockStrLength(32) }, 'someFieldName', { min: 29, max: 31 }).errors)
      .toEqual({ someFieldName: ErrorText.STR_MORE_THAN });
  });

  test('Data is empty', () => {
    expect(validateString({}, 'someFieldName').errors).toEqual({});
  });

  test('Data is empty with length', () => {
    expect(validateString({}, 'someFieldName', { length: 30 }).errors).toEqual({});
  });

  test('Data is undefined', () => {
    expect(validateString(undefined as unknown as ContainsField, 'someFieldName').errors).toEqual({});
  });

  test('String is undefined', () => {
    expect(validateString({ someFieldName: undefined }, 'someFieldName').errors)
      .toEqual({ someFieldName: ErrorText.NOT_BE_UNDEFINED });
  });


  test('String is {}', () => {
    expect(validateString({ someFieldName: {} }, 'someFieldName').errors)
      .toEqual({ someFieldName: ErrorText.INVALID_DATA });
  });

  test('String is []', () => {
    expect(validateString({ someFieldName: [] }, 'someFieldName').errors)
      .toEqual({ someFieldName: ErrorText.INVALID_DATA });
  });

  test('String is null', () => {
    expect(validateString({ someFieldName: null }, 'someFieldName').errors)
      .toEqual({ someFieldName: ErrorText.INVALID_DATA });
  });

  test('String is boolean = false', () => {
    expect(validateString({ someFieldName: false }, 'someFieldName').errors)
      .toEqual({ someFieldName: ErrorText.INVALID_DATA });
  });

  test('String is boolean = true', () => {
    expect(validateString({ someFieldName: true }, 'someFieldName').errors)
      .toEqual({ someFieldName: ErrorText.INVALID_DATA });
  });


  // Required

  test('Valid string, [required]', () => {
    expect(validateString({ someFieldName: getMockStrLength(30) }, 'someFieldName', { required: true }).errors).toEqual({});
  });

  test('Valid string, with length, [required]', () => {
    expect(validateString({ someFieldName: getMockStrLength(30) }, 'someFieldName', { required: true, length: 30 }).errors).toEqual({});
  });

  test('Empty string, with length, [required]', () => {
    expect(validateString({ someFieldName: '' }, 'someFieldName', { required: true, length: 30 }).errors)
      .toEqual({ someFieldName: ErrorText.MUST_BE_LENGTH });
  });

  test('Valid string, with min, [required]', () => {
    expect(validateString({ someFieldName: getMockStrLength(30) }, 'someFieldName', { required: true, min: 30 }).errors).toEqual({});
  });

  test('Valid string, with max, [required]', () => {
    expect(validateString({ someFieldName: getMockStrLength(30) }, 'someFieldName', { required: true, min: 30 }).errors).toEqual({});
  });

  test('Valid string, with min max, [required]', () => {
    expect(validateString({ someFieldName: getMockStrLength(30) }, 'someFieldName', { required: true, min: 30, max: 30 }).errors).toEqual({});
  });

  test('Valid string, with min max, [required]', () => {
    expect(validateString({ someFieldName: getMockStrLength(30) }, 'someFieldName', { required: true, min: 29, max: 31 }).errors).toEqual({});
  });

  test('String less min, [required]', () => {
    expect(validateString({ someFieldName: getMockStrLength(28) }, 'someFieldName', { required: true, min: 29, max: 31 }).errors)
      .toEqual({ someFieldName: ErrorText.STR_LESS_THAN });
  });

  test('String more max, [required]', () => {
    expect(validateString({ someFieldName: getMockStrLength(32) }, 'someFieldName', { required: true, min: 29, max: 31 }).errors)
      .toEqual({ someFieldName: ErrorText.STR_MORE_THAN });
  });

  test('Data is undefined', () => {
    expect(validateString(undefined as unknown as ContainsField, 'someFieldName', { required: true }).errors)
      .toEqual({ someFieldName: ErrorText.REQUIRED });
  });

  test('String is undefined, [required]', () => {
    expect(validateString({ someFieldName: undefined }, 'someFieldName', { required: true }).errors)
      .toEqual({ someFieldName: ErrorText.NOT_BE_UNDEFINED });
  });

  test('String is {}, [required]', () => {
    expect(validateString({ someFieldName: {} }, 'someFieldName', { required: true }).errors)
      .toEqual({ someFieldName: ErrorText.INVALID_DATA });
  });

  test('String is [], [required]', () => {
    expect(validateString({ someFieldName: [] }, 'someFieldName', { required: true }).errors)
      .toEqual({ someFieldName: ErrorText.INVALID_DATA });
  });

  test('String is null, [required]', () => {
    expect(validateString({ someFieldName: null }, 'someFieldName', { required: true }).errors)
      .toEqual({ someFieldName: ErrorText.INVALID_DATA });
  });

  test('String is boolean = false', () => {
    expect(validateString({ someFieldName: false }, 'someFieldName', { required: true }).errors)
      .toEqual({ someFieldName: ErrorText.INVALID_DATA });
  });

  test('String is boolean = true', () => {
    expect(validateString({ someFieldName: true }, 'someFieldName', { required: true }).errors)
      .toEqual({ someFieldName: ErrorText.INVALID_DATA });
  });
});

// npm run test:unit validate-string.test.ts
