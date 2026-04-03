import {
  getValidResult, isHasField, isEmptyStr, isFieldValueUndefined, isLessThan, isMoreThan, isNotRequiredLength,
  isNotHasField, isNotStr, isNotUndefined
} from '../../base';
import { ErrorText } from '../../errors-texts';
import { Validation } from '../../types';
import { ContainsField, ValidateStringOptions } from '../types';

/**
 * v.2023-05-08
 * Valid if ! required && ! data
 */
export const validateString = (
  data    : ContainsField,
  field   : string,
  options : ValidateStringOptions = {}
): Validation => {
  const
    { required, length, min, max } = options,
    value = data?.[field] as string;

  // If value is undefined
  if (isHasField(data, field) && isFieldValueUndefined(data, field))
    return getValidResult({ [field]: ErrorText.NOT_BE_UNDEFINED })

  // Check typeof
  if (isHasField(data, field) && isNotStr(value)) return getValidResult({ [field]: ErrorText.INVALID_DATA })

  // If required
  if (required) {
    if (! data || isNotHasField(data, field)) return getValidResult({ [field]: ErrorText.REQUIRED })
  }
  else if (! data || isNotHasField(data, field) || isEmptyStr(value)) return getValidResult()

  // Check length
  if (isNotUndefined(length)) {
    if (isNotRequiredLength(value, length as unknown as number))
      return getValidResult({ [field]: ErrorText.MUST_BE_LENGTH })
  }
  else {
    if (isNotUndefined(min) && isLessThan(value, min as unknown as number))
      return getValidResult({ [field]: ErrorText.STR_LESS_THAN })

    if (isNotUndefined(max) && isMoreThan(value, max as unknown as number))
      return getValidResult({ [field]: ErrorText.STR_MORE_THAN })
  }

  return getValidResult();
};
