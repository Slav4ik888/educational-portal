import { getValidResult, isNotEmail, isEmptyStr, isNotHasField } from '../../base';
import { ErrorText } from '../../errors-texts';
import { Validation } from '../../types';
import { validateString } from '../string';
import { ContainsField } from '../types';



/** Проверяем correct email, example for восстановления пароля */
export const validateEmail = (data: ContainsField, required?: boolean): Validation => {
  const res = validateString(data, 'email', { required, max: 50 });
  if (! res.valid) return res

  if (! required) {
    if (! data || isNotHasField(data, 'email') || isEmptyStr(data.email as string)) return getValidResult()
  }

  if (isNotEmail(data?.email as string)) return getValidResult({ email: ErrorText.EMAIL_INVALID });

  return getValidResult();
};
