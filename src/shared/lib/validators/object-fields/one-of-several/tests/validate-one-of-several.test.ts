import { ErrorText } from '../../../errors-texts';
import { validateOneOfSeveral } from '..';


enum LIST {
  first  = 'first',
  second = 'second',
  third  = 'third',
  fourth = 'fourth',
  fifth  = 'fifth'
}

describe('validateOneOfSeveral', () => {
  // Not required

  test('Valid list', () => {
    expect(validateOneOfSeveral({ someFieldName: 'first' }, 'someFieldName', LIST).errors).toEqual({});
  });

  test('Value not one of several', () => {
    expect(validateOneOfSeveral({ someFieldName: 'error_nuh' }, 'someFieldName', LIST).errors)
      .toEqual({ someFieldName: ErrorText.NOT_ONE_OF_SEVERAL });
  });

  test('Data is undefined', () => {
  // @ts-ignore
    expect(validateOneOfSeveral(undefined, 'someFieldName', LIST).errors)
      .toEqual({});
  });

  test('Status is undefined', () => {
    expect(validateOneOfSeveral({ someFieldName: undefined }, 'someFieldName', LIST).errors)
      .toEqual({ someFieldName: ErrorText.NOT_BE_UNDEFINED });
  });


  // Required

  test('Valid list, [required]', () => {
    expect(validateOneOfSeveral({ someFieldName: 'first' }, 'someFieldName', LIST, { required: true }).errors).toEqual({});
  });

  test('Value not one of several, [required]', () => {
    expect(validateOneOfSeveral({ someFieldName: 'error_nuh' }, 'someFieldName', LIST, { required: true }).errors)
      .toEqual({ someFieldName: ErrorText.NOT_ONE_OF_SEVERAL });
  });

  test('Data is undefined, [required]', () => {
  // @ts-ignore
    expect(validateOneOfSeveral(undefined, 'someFieldName', LIST, { required: true }).errors)
      .toEqual({ someFieldName: ErrorText.REQUIRED });
  });

  test('Status is undefined, [required]', () => {
    expect(validateOneOfSeveral({ someFieldName: undefined }, 'someFieldName', LIST, { required: true }).errors)
      .toEqual({ someFieldName: ErrorText.NOT_BE_UNDEFINED });
  });
});

// npm run test:unit validate-one-of-several.test.ts
