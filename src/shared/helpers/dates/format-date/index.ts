import { isUndefined } from 'shared/lib/validators';
import { FORMAT, getMonth, getMonthDDсYYYY, getMonthYYYY, SUB, getDDMonthYYYY,
getDMonthYYYY, getDMonthYYYYHHMM, getYYYYMMDDt, getYYYYMMDD, getDDMMYYYYt, getDDMMYYYYd,
getDDMMYYdHHMM, getHHMM, getDDMonYY, getDDMMYYd, getDDmonYY } from '..';


// Validate
const isNoCorrect = (ms: number) => ! ms || ms < 0 || typeof ms !== 'number';


/**
 * v.2024-09-12
 * Возвращаем дату от time в нужном формате
 * @return {string} - дата в нужном формате
 */
export function formatDate(
  _ms    : number | string | undefined, // таймстамп
  format : FORMAT,          // формат, в котором нужно вернуть ms
  sub    : SUB = SUB.EN,    // если нужно в на русском или нужно склонение 'Февраля'
): string {                 // дата в нужном формате
  if (isUndefined(_ms)) return 'Указана некорректная дата';

  let date;

  if (Date.parse(_ms as string)) date = new Date(_ms as string)
  else {
    const ms = parseInt(_ms as string, 10);
    if (isNoCorrect(ms)) return 'Указана некорректная дата';
    date = new Date(ms);
  }


  switch (format) {
    case 'Month':              return getMonth(date, sub);
    case 'Month YYYY':         return getMonthYYYY(date, sub);
    case 'Month DD, YYYY':     return getMonthDDсYYYY(date, sub);
    case 'DD Month YYYY':      return getDDMonthYYYY(date, sub);
    case 'D Month YYYY':       return getDMonthYYYY(date, sub);
    case 'D Month YYYY HH:MM': return getDMonthYYYYHHMM(date, sub);
    case 'DD Mon YY':          return getDDMonYY(date, sub);
    case 'DD mon YY':          return getDDmonYY(date, sub);
    case 'YYYY-MM-DD':         return getYYYYMMDDt(date);
    case 'YYYYMMDD':           return getYYYYMMDD(date);
    case 'DD-MM-YYYY':         return getDDMMYYYYt(date);
    case 'DD.MM.YYYY':         return getDDMMYYYYd(date);
    case 'DD.MM.YY':           return getDDMMYYd(date);
    case 'DD.MM.YY HH:MM':     return getDDMMYYdHHMM(date);
    case 'HH:MM':              return getHHMM(date);

    default: return String(date);
  }
}
