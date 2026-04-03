import { FORMAT, SUB } from '../utils/consts';

interface Item {
  ms          : number | string,
  format      : FORMAT,
  sub?        : SUB;
}

interface ArrayItem extends Array<string | Item> {
  0: Item,
  1: string
}

const arr: Array<ArrayItem> = [
  [{ ms: undefined as unknown as number, format: 'Month' }, 'Указана некорректная дата'],
  [{ ms: null as unknown as number,      format: 'Month' }, 'Указана некорректная дата'],
  [{ ms: 0,         format: 'Month' }, 'January'],
  [{ ms: '-1',      format: 'Month' }, 'January'],
  [{ ms: -1,        format: 'Month' }, 'January'],
  [{ ms: '123',     format: 'Month' }, 'January'],
  [{ ms: '1640995200000', format: 'Month' }, 'January'],
  [{ ms: 'Sat Jan 01 2022 19:29:31 GMT+0800 (Иркутск, стандартное время)', format: 'Month' }, 'January'],

  // 'Month'
  [{ ms: 1640995200000, format: 'Month' }, 'January'],
  [{ ms: 1640995200000, format: 'Month', sub: SUB.EN }, 'January'],
  [{ ms: 1640995200000, format: 'Month', sub: SUB.RU }, 'Январь'],
  [{ ms: 1640995200000, format: 'Month', sub: SUB.RU_DECL }, 'Января'],

  // 'Month YYYY'
  [{ ms: 1640995200000, format: 'Month YYYY' }, 'January 2022'],
  [{ ms: 1640995200000, format: 'Month YYYY', sub: SUB.EN }, 'January 2022'],
  [{ ms: 1640995200000, format: 'Month YYYY', sub: SUB.RU }, 'Январь 2022'],
  [{ ms: 1640995200000, format: 'Month YYYY', sub: SUB.RU_DECL }, 'Января 2022'],

  // 'Month DD, YYYY'
  [{ ms: 1640995200000, format: 'Month DD, YYYY' }, 'January 01 2022'],
  [{ ms: 1640995200000, format: 'Month DD, YYYY', sub: SUB.EN }, 'January 01 2022'],
  [{ ms: 1640995200000, format: 'Month DD, YYYY', sub: SUB.RU }, 'Январь 01 2022'],
  [{ ms: 1640995200000, format: 'Month DD, YYYY', sub: SUB.RU_DECL }, 'Января 01 2022'],

  // 'DD Month YYYY'
  [{ ms: 1640995200000, format: 'DD Month YYYY' }, '01 January 2022'],
  [{ ms: 1640995200000, format: 'DD Month YYYY', sub: SUB.EN }, '01 January 2022'],
  [{ ms: 1640995200000, format: 'DD Month YYYY', sub: SUB.RU }, '01 Январь 2022'],
  [{ ms: 1640995200000, format: 'DD Month YYYY', sub: SUB.RU_DECL }, '01 Января 2022'],

  // 'D Month YYYY'
  [{ ms: 1640995200000, format: 'D Month YYYY' }, '1 January 2022'],
  [{ ms: 1640995200000, format: 'D Month YYYY', sub: SUB.EN }, '1 January 2022'],
  [{ ms: 1640995200000, format: 'D Month YYYY', sub: SUB.RU }, '1 Январь 2022'],
  [{ ms: 1640995200000, format: 'D Month YYYY', sub: SUB.RU_DECL }, '1 Января 2022'],

  // 'DD Mon YY'
  [{ ms: 1682974800001, format: 'DD Mon YY', sub: SUB.RU_ABBR }, '02 Май 23'],
  [{ ms: 1682974800001, format: 'DD Mon YY', sub: SUB.RU_ABBR_DEC }, '02 Мая 23'],

  // 'DD mon YY'
  [{ ms: 1682974800001, format: 'DD mon YY', sub: SUB.RU_ABBR }, '02 май 23'],
  [{ ms: 1682974800001, format: 'DD mon YY', sub: SUB.RU_ABBR_DEC }, '02 мая 23'],

  // FORMAT.DMonthYYYYHHMM 'D Month YYYY HH:MM'
  // [{ ms: 1640995200000, format: FORMAT.DMonthYYYYHHMM }, '1 January 2022 08:00'],
  // [{ ms: 1640995200000, format: FORMAT.DMonthYYYYHHMM, sub: SUB.EN }, '1 January 2022 08:00'],
  // [{ ms: 1640995200000, format: FORMAT.DMonthYYYYHHMM, sub: SUB.RU }, '1 Январь 2022 08:00'],
  // [{ ms: 1640995200000, format: FORMAT.DMonthYYYYHHMM, sub: SUB.RU_DECL }, '1 Января 2022 08:00'],
  // [{ ms: 'Sat Jan 01 2022 19:29:31 GMT+0800 (Иркутск, стандартное время)', format: FORMAT.DMonthYYYYHHMM, sub: SUB.RU_DECL }, '1 Января 2022 19:29'],
  // [{ ms: 1641036571000, format: FORMAT.DMonthYYYYHHMM, sub: SUB.RU_DECL }, '1 Января 2022 19:29'],
  // [{ ms: 'Sun Jan 02 2022 09:10:13 GMT+0800 (Иркутск, стандартное время)', format: FORMAT.DMonthYYYYHHMM, sub: SUB.RU_DECL }, '2 Января 2022 09:10'],
  // [{ ms: 1641085896541, format: FORMAT.DMonthYYYYHHMM, sub: SUB.RU_DECL }, '2 Января 2022 09:11'],

  // 'YYYY-MM-DD'
  [{ ms: 1640995200000, format: 'YYYY-MM-DD' }, '2022-01-01'],
  [{ ms: 1640995200000, format: 'YYYY-MM-DD' }, '2022-01-01'],
  [{ ms: 1640995200000, format: 'YYYY-MM-DD' }, '2022-01-01'],
  [{ ms: 1640995200000, format: 'YYYY-MM-DD' }, '2022-01-01'],
  [{ ms: 1641036571000, format: 'YYYY-MM-DD' }, '2022-01-01'],
  [{ ms: 1641085896541, format: 'YYYY-MM-DD' }, '2022-01-02'],

  // 'YYYYMMDD'
  [{ ms: 1640995200000, format: 'YYYYMMDD' }, '20220101'],
  [{ ms: 1640995200000, format: 'YYYYMMDD' }, '20220101'],
  [{ ms: 1640995200000, format: 'YYYYMMDD' }, '20220101'],
  [{ ms: 1640995200000, format: 'YYYYMMDD' }, '20220101'],
  [{ ms: 1641036571000, format: 'YYYYMMDD' }, '20220101'],
  [{ ms: 1641085896541, format: 'YYYYMMDD' }, '20220102'],

  // 'DD-MM-YYYY'
  [{ ms: 1640995200000, format: 'DD-MM-YYYY' }, '01-01-2022'],
  [{ ms: 1640995200000, format: 'DD-MM-YYYY' }, '01-01-2022'],
  [{ ms: 1640995200000, format: 'DD-MM-YYYY' }, '01-01-2022'],
  [{ ms: 1640995200000, format: 'DD-MM-YYYY' }, '01-01-2022'],
  [{ ms: 1641036571000, format: 'DD-MM-YYYY' }, '01-01-2022'],
  [{ ms: 1641085896541, format: 'DD-MM-YYYY' }, '02-01-2022'],

  // 'DD.MM.YYYY'
  [{ ms: 1640995200000, format: 'DD.MM.YYYY' }, '01.01.2022'],
  [{ ms: 1640995200000, format: 'DD.MM.YYYY' }, '01.01.2022'],
  [{ ms: 1640995200000, format: 'DD.MM.YYYY' }, '01.01.2022'],
  [{ ms: 1640995200000, format: 'DD.MM.YYYY' }, '01.01.2022'],
  [{ ms: 1641036571000, format: 'DD.MM.YYYY' }, '01.01.2022'],
  [{ ms: 1641085896541, format: 'DD.MM.YYYY' }, '02.01.2022'],

  // 'DD.MM.YY'
  [{ ms: 1640995200000, format: 'DD.MM.YY' }, '01.01.22'],
  [{ ms: 1641085896541, format: 'DD.MM.YY' }, '02.01.22'],

  // FORMAT.DDMMYYdHHMM 'DD.MM.YY HH:MM'
  // [{ ms: 1640995200000, format: FORMAT.DDMMYYdHHMM }, '01.01.22 08:00'],
  // [{ ms: 1640995200000, format: FORMAT.DDMMYYdHHMM }, '01.01.22 08:00'],
  // [{ ms: 1640995200000, format: FORMAT.DDMMYYdHHMM }, '01.01.22 08:00'],
  // [{ ms: 1640995200000, format: FORMAT.DDMMYYdHHMM }, '01.01.22 08:00'],
  // [{ ms: 1641036571000, format: FORMAT.DDMMYYdHHMM }, '01.01.22 19:29'],
  // [{ ms: 1641085896541, format: FORMAT.DDMMYYdHHMM }, '02.01.22 09:11'],

  // FORMAT.HHMM 'HH:MM'
  // [{ ms: 1640995200000, format: FORMAT.HHMM }, '08:00'],
  // [{ ms: 1640995200000, format: FORMAT.HHMM }, '08:00'],
  // [{ ms: 1640995200000, format: FORMAT.HHMM }, '08:00'],
  // [{ ms: 1640995200000, format: FORMAT.HHMM }, '08:00'],
  // [{ ms: 1641036571000, format: FORMAT.HHMM }, '19:29'],
  // [{ ms: 1641085896541, format: FORMAT.HHMM }, '09:11'],

];

export default arr;
