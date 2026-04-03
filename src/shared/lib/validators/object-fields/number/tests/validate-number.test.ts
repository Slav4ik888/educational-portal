import { ErrorText } from '../../../errors-texts';
import { validateNumber } from '..';



describe('validateNumber', () => {
  // Not required

  test('Valid string', () => {
    expect(validateNumber({ someFieldName: 100 }, 'someFieldName').errors).toEqual({});
  });

  test('Valid string, with min', () => {
    expect(validateNumber({ someFieldName: 100 }, 'someFieldName', { min: 99 }).errors).toEqual({});
  });

  test('Valid string, with max', () => {
    expect(validateNumber({ someFieldName: 100 }, 'someFieldName', { max: 101 }).errors).toEqual({});
  });

  test('Valid string, with min max', () => {
    expect(validateNumber({ someFieldName: 100 }, 'someFieldName', { min: 100, max: 100 }).errors).toEqual({});
  });

  test('Valid string, with min max', () => {
    expect(validateNumber({ someFieldName: 100 }, 'someFieldName', { min: 99, max: 101 }).errors).toEqual({});
  });

  test('Number less min', () => {
    expect(validateNumber({ someFieldName: 28 }, 'someFieldName', { min: 29, max: 31 }).errors)
      .toEqual({ someFieldName: ErrorText.NUM_LESS_THAN });
  });

  test('Number more max', () => {
    expect(validateNumber({ someFieldName: 32 }, 'someFieldName', { min: 29, max: 31 }).errors)
      .toEqual({ someFieldName: ErrorText.NUM_MORE_THAN });
  });

  test('Data is empty', () => {
    expect(validateNumber({}, 'someFieldName').errors).toEqual({});
  });

  test('Data is empty with min', () => {
    expect(validateNumber({}, 'someFieldName', { min: 30 }).errors).toEqual({});
  });

  test('Data is undefined', () => {
    // @ts-ignore
    expect(validateNumber(undefined, 'someFieldName').errors).toEqual({});
  });

  test('Number is undefined', () => {
    expect(validateNumber({ someFieldName: undefined }, 'someFieldName').errors)
      .toEqual({ someFieldName: ErrorText.NOT_BE_UNDEFINED });
  });


  test('Number is {}', () => {
    expect(validateNumber({ someFieldName: {} }, 'someFieldName').errors)
      .toEqual({ someFieldName: ErrorText.INVALID_DATA });
  });

  test('Number is []', () => {
    expect(validateNumber({ someFieldName: [] }, 'someFieldName').errors)
      .toEqual({ someFieldName: ErrorText.INVALID_DATA });
  });

  test('Number is null', () => {
    expect(validateNumber({ someFieldName: null }, 'someFieldName').errors)
      .toEqual({ someFieldName: ErrorText.INVALID_DATA });
  });

  test('Number is boolean = false', () => {
    expect(validateNumber({ someFieldName: false }, 'someFieldName').errors)
      .toEqual({ someFieldName: ErrorText.INVALID_DATA });
  });

  test('Number is boolean = true', () => {
    expect(validateNumber({ someFieldName: true }, 'someFieldName').errors)
      .toEqual({ someFieldName: ErrorText.INVALID_DATA });
  });


  // Required

  test('Valid string, [required]', () => {
    expect(validateNumber({ someFieldName: 100 }, 'someFieldName', { required: true }).errors).toEqual({});
  });

  test('Valid string, with min, [required]', () => {
    expect(validateNumber({ someFieldName: 100 }, 'someFieldName', { required: true, min: 100 }).errors).toEqual({});
  });

  test('Valid string, with max, [required]', () => {
    expect(validateNumber({ someFieldName: 100 }, 'someFieldName', { required: true, max: 100 }).errors).toEqual({});
  });

  test('Valid string, with min max, [required]', () => {
    expect(validateNumber({ someFieldName: 100 }, 'someFieldName', { required: true, min: 100, max: 100 }).errors).toEqual({});
  });

  test('Valid string, with min max, [required]', () => {
    expect(validateNumber({ someFieldName: 100 }, 'someFieldName', { required: true, min: 99, max: 101 }).errors).toEqual({});
  });

  test('Number less min, [required]', () => {
    expect(validateNumber({ someFieldName: 28 }, 'someFieldName', { required: true, min: 29, max: 31 }).errors)
      .toEqual({ someFieldName: ErrorText.NUM_LESS_THAN });
  });

  test('Number more max, [required]', () => {
    expect(validateNumber({ someFieldName: 32 }, 'someFieldName', { required: true, min: 29, max: 31 }).errors)
      .toEqual({ someFieldName: ErrorText.NUM_MORE_THAN });
  });

  test('Data is undefined', () => {
    // @ts-ignore
    expect(validateNumber(undefined, 'someFieldName', { required: true }).errors)
      .toEqual({ someFieldName: ErrorText.REQUIRED });
  });

  test('Number is undefined, [required]', () => {
    expect(validateNumber({ someFieldName: undefined }, 'someFieldName', { required: true }).errors)
      .toEqual({ someFieldName: ErrorText.NOT_BE_UNDEFINED });
  });

  test('Number is {}, [required]', () => {
    expect(validateNumber({ someFieldName: {} }, 'someFieldName', { required: true }).errors)
      .toEqual({ someFieldName: ErrorText.INVALID_DATA });
  });

  test('Number is [], [required]', () => {
    expect(validateNumber({ someFieldName: [] }, 'someFieldName', { required: true }).errors)
      .toEqual({ someFieldName: ErrorText.INVALID_DATA });
  });

  test('Number is null, [required]', () => {
    expect(validateNumber({ someFieldName: null }, 'someFieldName', { required: true }).errors)
      .toEqual({ someFieldName: ErrorText.INVALID_DATA });
  });

  test('Number is boolean = false', () => {
    expect(validateNumber({ someFieldName: false }, 'someFieldName', { required: true }).errors)
      .toEqual({ someFieldName: ErrorText.INVALID_DATA });
  });

  test('Number is boolean = true', () => {
    expect(validateNumber({ someFieldName: true }, 'someFieldName', { required: true }).errors)
      .toEqual({ someFieldName: ErrorText.INVALID_DATA });
  });
});

// npm run test:unit validate-number.test.ts
