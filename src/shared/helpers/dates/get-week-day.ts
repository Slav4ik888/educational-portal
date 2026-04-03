import { WEEK_DAYS, WEEK_DAYS_FULL, WEEK_DAYS_RU } from './utils/consts';


/**
 * Возвращает день недель в нужном формате
 */
export function getWeekDay(
  timestamp : number, // таймстамп
  format    : string  // формат, в котором нужно вернуть timestamp
): string {           // день недели в нужном формате
  const newDate = new Date(timestamp);

  const formatType = {
    smallEng: 'smallEng',
    smallRus: 'smallRus',
    largeRus: 'largeRus',
  };

  switch (format) {
    case formatType.smallEng:
      return WEEK_DAYS[newDate.getDay()];

    case formatType.smallRus:
      return WEEK_DAYS_RU[newDate.getDay()];

    case formatType.largeRus:
      return WEEK_DAYS_FULL[newDate.getDay()];

    default: return timestamp.toString();
  }
}
