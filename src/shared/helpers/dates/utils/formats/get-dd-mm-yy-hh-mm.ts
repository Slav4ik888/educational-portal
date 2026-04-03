import { withZero } from '../../with-zero';



export const getDDMMYYdHHMM = (date: Date): string => {
  const day   = withZero(date.getDate());
  const month = withZero(date.getMonth() + 1);
  const year  = date.getFullYear().toString().slice(-2);
  const hours = withZero(date.getHours());
  const mins  = withZero(date.getMinutes());

  return `${day}.${month}.${year} ${hours}:${mins}` // `DD.MM.YY HH:MM`
};
