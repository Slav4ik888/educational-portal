import { SUB } from '..';
import { withZero } from '../../with-zero';
import { getMonth } from './get-month';



export const getDMonthYYYYHHMM = (date: Date, sub: SUB): string => {
  const day   = date.getDate();
  const month = getMonth(date, sub);
  const year  = date.getFullYear();
  const hours = withZero(date.getHours());
  const mins  = withZero(date.getMinutes());

  return `${day} ${month} ${year} ${hours}:${mins}` // `D Month YYYY HH:MM`
};
