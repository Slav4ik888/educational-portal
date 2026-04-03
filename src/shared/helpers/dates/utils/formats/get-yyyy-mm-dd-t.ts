import { withZero } from '../../with-zero';



export const getYYYYMMDDt = (date: Date): string => {
  const day   = withZero(date.getDate());
  const month = withZero(date.getMonth() + 1);
  const year  = date.getFullYear();

  return `${year}-${month}-${day}` // `YYYY-MM-DD`
};
