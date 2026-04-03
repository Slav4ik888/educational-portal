import { SUB } from '..';
import { withZero } from '../../with-zero';
import { getMonth } from './get-month';



export const getDDmonYY = (date: Date, sub: SUB): string => {
  const day   = withZero(date.getDate());
  const month = getMonth(date, sub).toLowerCase();
  const year  = date.getFullYear().toString().slice(-2);

  return `${day} ${month} ${year}` // 'DD mon YY'
};
