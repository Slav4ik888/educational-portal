import { Errors, Validation } from '../../types';


/** v.23-07-22 */
export const getValidResult = (errors: Errors = {}): Validation => ({
  errors,
  valid: Object.keys(errors).length === 0
});
