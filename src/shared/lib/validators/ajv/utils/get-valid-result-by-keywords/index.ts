import { AnyValidateFunction } from 'ajv/dist/core';
import { Errors, Validation } from '../../../types';
import { getErrorText } from '../get-error-text';
import { ERROR_NAME } from '../get-error-text/error-text';
import { getValidResult } from '../../../base/get-valid-result';
import { getLabelByInstancePath, getName } from './utils';
import { __devLog } from '../../../../tests/__dev-log';



export const getValidResultByKeywords = (
  validate? : AnyValidateFunction<unknown>,
  T?        : string // Titles // Translate schema  styles.document.structure.dialogTitle
): Validation => {
  if (! validate?.errors?.length) return getValidResult();
  // __devLog('getValidResultByKeywords', 'validate?.errors: ', JSON.stringify(validate?.errors, null, 2));

  const errors = {} as Errors;

  // eslint-disable-next-line
  for (const err of validate.errors) {
    // __devLog('getValidResultByKeywords', 'err: ', err);
    const { keyword, params } = err;

    const label = getLabelByInstancePath(err);
    // __devLog('getValidResultByKeywords', 'label: ', label);

    switch (keyword) {
      case 'type':
        if (label) errors[label] = getErrorText(ERROR_NAME.INVALID_FORMAT, getName(label));
        else errors.general = getErrorText(ERROR_NAME.INVALID_FORMAT);
        break;

      case 'required':
        errors[params.missingProperty] = getErrorText(ERROR_NAME.REQUIRED, params.missingProperty);
        // switch (err.params.missingProperty) {
        //   case 'permissions': errors[err.params.missingProperty] = getErrorText(ERR_TEMP.MustBePermissions); break;
        //   default: errors[err.params.missingProperty] = getErrorText(ERR_TEMP.MustNotBeEmpty, getName(err.params.missingProperty)); break;
        // }
        break;

    //   case 'enum':
    //     switch (label) {
    //       case 'permissions': errors[label] = getErrorText(ERR_TEMP.MustBePermissions); break;
    //     }
    //     break;

      case 'additionalProperties':
        errors[params.additionalProperty] = getErrorText(ERROR_NAME.ADDITIONAL_PROPERTIES, params.additionalProperty);
        break;

      case 'minLength':
        if (err.params.limit === 1) errors[label] = getErrorText(ERROR_NAME.MUST_NOT_BE_EMPTY, getName(label));
        else errors[label] = getErrorText(ERROR_NAME.STR_LESS_THAN, getName(label), err.params.limit);
        break;

      case 'maxLength':
        errors[label] = getErrorText(ERROR_NAME.STR_MORE_THAN, getName(label), err.params.limit);
        break;

      case 'minimum':
        errors[label] = getErrorText(ERROR_NAME.NUM_LESS_THAN, getName(label), err.params.limit);
        break;

      case 'maximum':
        errors[label] = getErrorText(ERROR_NAME.NUM_MORE_THAN, getName(label), err.params.limit);
        break;

      case 'maxItems':
        errors[label] = getErrorText(ERROR_NAME.MAX_ITEMS, getName(label), err.params.limit);
        break;

      case 'oneOf':
        errors[label] = getErrorText(ERROR_NAME.INVALID_ONE_OF, getName(label));
        break;

    //   case 'pattern':
    //     errors[label] = getErrorText(ERR_TEMP.InvalidData, getName(label), err.params.pattern);
    //     break;

      case 'const':
        if (label === 'confirmPassword') errors[label] = getErrorText(ERROR_NAME.PASSWORD_NOT_EQUAL_CONF);
        else if (label === 'permissions') errors[label] = getErrorText(ERROR_NAME.PERMISSONS_DISABLED);
        else errors[label] = getErrorText(ERROR_NAME.CONSTANT, getName(label), getName(err.params.allowedValue));
        break;

      case 'format':
        if (label === 'email') errors[label] = getErrorText(ERROR_NAME.INVALID_FORMAT, getName(label));
        else errors[label] = getErrorText(ERROR_NAME.INVALID_FORMAT, getName(label));
        break;

      case 'isSubscriptionType':
      case 'isMimeType':
      case 'isRuleType':
        errors.type = getErrorText(ERROR_NAME.MUST_BE_ONE_OF_SEVERAL, 'type');
        break;

      case 'isCourseAccessStatus':
        errors.courseAccess = getErrorText(ERROR_NAME.MUST_BE_ONE_OF_SEVERAL, 'courseAccess');
        break;

      case 'isCompanyStatusType':
      case 'isSubscriberStatus':
        errors.status = getErrorText(ERROR_NAME.MUST_BE_ONE_OF_SEVERAL, 'status');
        break;

      case 'isSubscriberWhereFrom':
        errors.whereFrom = getErrorText(ERROR_NAME.MUST_BE_ONE_OF_SEVERAL, 'whereFrom');
        break;

      case 'isITN':
        errors.ITN = getErrorText(ERROR_NAME.ITN);
        break;

      default: errors.general = err.message || '';
    }
  }

  // __devLog('getValidResultByKeywords', 'errors: ', errors);

  return getValidResult(errors);
};
