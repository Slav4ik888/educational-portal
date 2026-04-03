import { withZero } from '../../with-zero';



export const getHHMM = (date: Date): string => {
  const hours = withZero(date.getHours());
  const mins  = withZero(date.getMinutes());

  return `${hours}:${mins}` // `HH:MM`
};
