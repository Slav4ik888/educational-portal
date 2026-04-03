import { Errors, isObj } from '../../validators';

/**
 * For slices
 */
export const getPayloadError = (payload: Errors | undefined): Errors => isObj(payload)
  ? payload as Errors
  : {} as Errors;
