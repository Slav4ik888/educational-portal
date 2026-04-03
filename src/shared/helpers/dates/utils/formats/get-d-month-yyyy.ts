import { SUB } from '..';
import { getMonth } from './get-month';



export const getDMonthYYYY = (date: Date, sub: SUB): string => {
  const day   = date.getDate();
  const month = getMonth(date, sub);
  const year  = date.getFullYear();

  return `${day} ${month} ${year}` // `D Month YYYY`
};
