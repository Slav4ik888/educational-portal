import { withZero } from '../../with-zero';



export const getDDMMYYYYt = (date: Date): string => {
  const day   = withZero(date.getDate());
  const month = withZero(date.getMonth() + 1);
  const year  = date.getFullYear();

  return `${day}-${month}-${year}` // `DD-MM-YYYY`
};
