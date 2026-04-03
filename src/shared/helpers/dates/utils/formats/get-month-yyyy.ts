import { SUB } from '..';
import { getMonth } from './get-month';


export const getMonthYYYY = (date: Date, sub: SUB): string => {
  const month = getMonth(date, sub);
  const year  = date.getFullYear();

  return `${month} ${year}` // `Month YYYY`
};
