import {
  getValidResult, isHasField, isFieldValueBool, isFieldValueUndefined, isNotBool, isNotHasField
 } from '../../base';
import { ErrorText } from '../../errors-texts';
import { Validation } from '../../types';
import { ContainsField, ValidateOptions } from '../types';


export const validateBoolean = (data: ContainsField, field: string, options: ValidateOptions = {}): Validation => {
  const { required } = options;

  // If value is undefined
  if (isHasField(data, field) && isFieldValueUndefined(data, field))
    return getValidResult({ [field]: ErrorText.NOT_BE_UNDEFINED });

  // Check typeof
  if (isHasField(data, field) && isNotBool(data[field])) return getValidResult({ [field]: ErrorText.INVALID_DATA })

  // If required
  if (required) {
    if (! data || isNotHasField(data, field)) return getValidResult({ [field]: ErrorText.REQUIRED });
  }

  if (! data) return getValidResult();
  if (isNotHasField(data, field)) return getValidResult();
  if (! isFieldValueBool(data, field)) return getValidResult({ [field]: ErrorText.INVALID_DATA })

  return getValidResult();
};
