import { day } from '../utils';

/** Сколько дней вмещается в промежуток */
export const getDays = (period: number): number => {
  if (! period || period < 0) return 0
  const value = day(1);

  return Math.ceil(period / value)
}
