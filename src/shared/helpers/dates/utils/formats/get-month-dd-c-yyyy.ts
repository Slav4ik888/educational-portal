import { SUB } from '..';
import { withZero } from '../../with-zero';
import { getMonth } from './get-month';


export const getMonthDDсYYYY = (date: Date, sub: SUB): string => {
  const day   = withZero(date.getDate());
  const month = getMonth(date, sub);
  const year  = date.getFullYear();

  return `${month} ${day} ${year}` // `Month DD, YYYY`
};
