import { withZero } from '../../with-zero';



export const getDDMMYYd = (date: Date): string => {
  const day   = withZero(date.getDate());
  const month = withZero(date.getMonth() + 1);
  const year  = date.getFullYear().toString().slice(-2);

  return `${day}.${month}.${year}` // `DD.MM.YY`
};
