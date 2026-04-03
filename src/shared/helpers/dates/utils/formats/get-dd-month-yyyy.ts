import { SUB } from '..';
import { withZero } from '../../with-zero';
import { getMonth } from './get-month';



export const getDDMonthYYYY = (date: Date, sub: SUB): string => {
  const day   = withZero(date.getDate());
  const month = getMonth(date, sub);
  const year  = date.getFullYear();

  return `${day} ${month} ${year}` // `DD Month YYYY`
};
