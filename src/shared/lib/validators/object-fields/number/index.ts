import { getValidResult, isHasField, isFieldValueUndefined, isNotHasField, isNotNum, isNotUndefined } from '../../base';
import { ErrorText } from '../../errors-texts';
import { ContainsField, ValidateNumberOptions } from '../types';
import { Validation } from '../../types';


/**
 * v.2023-09-22
 * Valid if ! required && ! data
 */
export const validateNumber = (
  data    : ContainsField,
  field   : string,
  options : ValidateNumberOptions = {}
): Validation => {
  const
    { required, min, max } = options,
    value = data?.[field] as number;

  // If value is undefined
  if (isHasField(data, field) && isFieldValueUndefined(data, field))
    return getValidResult({ [field]: ErrorText.NOT_BE_UNDEFINED })

  // Check typeof
  if (isHasField(data, field) && isNotNum(value)) return getValidResult({ [field]: ErrorText.INVALID_DATA })

  // If required
  if (required) {
    if (! data || isNotHasField(data, field)) return getValidResult({ [field]: ErrorText.REQUIRED })
  }
  else if (! data || isNotHasField(data, field)) return getValidResult()

  // Check min max
  if (isNotUndefined(min) && value < (min as unknown as number))
    return getValidResult({ [field]: ErrorText.NUM_LESS_THAN })
  if (isNotUndefined(max) && value > (max as unknown as number))
    return getValidResult({ [field]: ErrorText.NUM_MORE_THAN })

  return getValidResult();
};
