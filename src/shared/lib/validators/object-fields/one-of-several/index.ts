import {
  getValidResult, isHasField, isEmptyStr, isFieldValueUndefined, isNotOneOfSeveral, isNotHasField
 } from '../../base';
import { ErrorText } from '../../errors-texts';
import { Validation } from '../../types';
import { ContainsField, ValidateOptions } from '../types';

/**
 * v.2023-05-09
 */
export const validateOneOfSeveral = (
  data    : ContainsField,
  field   : string,
  list    : object,
  options : ValidateOptions = {}
): Validation => {
  const
    { required } = options,
    value = data?.[field] as string;

  // If value is undefined
  if (isHasField(data, field) && isFieldValueUndefined(data, field))
    return getValidResult({ [field]: ErrorText.NOT_BE_UNDEFINED })


  // If required
  if (required) {
    if (! data || isNotHasField(data, field)) return getValidResult({ [field]: ErrorText.REQUIRED })
  }
  else if (! data || isNotHasField(data, field) || isEmptyStr(value)) return getValidResult()

  // Checking value for a match with list
  if (isNotOneOfSeveral(Object.values(list), value)) return getValidResult({ [field]: ErrorText.NOT_ONE_OF_SEVERAL })

  return getValidResult();
};
