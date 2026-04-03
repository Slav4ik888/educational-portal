
export type FORMAT = 'Month'
  | 'Month YYYY'
  | 'Month DD, YYYY'
  | 'DD Month YYYY'
  | 'D Month YYYY'
  | 'D Month YYYY HH:MM'
  | 'DD Mon YY'
  | 'DD mon YY'
  | 'YYYY-MM-DD'
  | 'YYYYMMDD'
  | 'DD-MM-YYYY'
  | 'DD.MM.YYYY'
  | 'DD.MM.YY'
  | 'DD.MM.YY HH:MM'
  | 'HH:MM'

// export enum FORMAT {
//   Month          = 'Month',
//   MonthYYYY      = 'Month YYYY',
//   MonthDDсYYYY   = 'Month DD, YYYY',
//   DDMonthYYYY    = 'DD Month YYYY',
//   DMonthYYYY     = 'D Month YYYY',
//   DMonthYYYYHHMM = 'D Month YYYY HH:MM',
//   YYYYMMDDt      = 'YYYY-MM-DD',
//   YYYYMMDD       = 'YYYYMMDD',
//   DDMMYYYYt      = 'DD-MM-YYYY',
//   DDMMYYYYd      = 'DD.MM.YYYY',
//   DDMMYYd        = 'DD.MM.YY',
//   DDMMYYdHHMM    = 'DD.MM.YY HH:MM',
//   HHMM           = 'HH:MM',
// }

// TODO: type SUB = 'en' | 'ru' | 'ru_decl' | 'ru_abbr' | 'ru_abbr_dec'

export enum SUB {
  EN          = 'en',
  RU          = 'ru',
  RU_DECL     = 'ru_decl',
  RU_ABBR     = 'ru_abbr',
  RU_ABBR_DEC = 'ru_abbr_dec',
}

/* eslint-disable */

export const WEEK_DAYS              = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
export const WEEK_DAYS_RU           = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
export const WEEK_DAYS_FULL         = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

export const MONTH_NAME             = ['January', 'February', 'March', 'April',  'May', 'June', 'July', 'August',  'September', 'October', 'November', 'December'];
export const MONTH_NAME_RU          = ['Январь',  'Февраль',  'Март',  'Апрель', 'Май', 'Июнь', 'Июль', 'Август',  'Сентябрь',  'Октябрь', 'Ноябрь',   'Декабрь'];
export const MONTH_NAME_RU_DEC      = ['Января',  'Февраля',  'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября',  'Октября', 'Ноября',   'Декабря'];
export const MONTH_NAME_RU_ABBR     = ['Янв',     'Фев',      'Мар',   'Апр',    'Май', 'Июн',  'Июл',  'Авг',     'Сен',       'Окт',     'Ноя',      'Дек'];
export const MONTH_NAME_RU_ABBR_DEC = ['Янв',     'Фев',      'Мар',   'Апр',    'Мая', 'Июн',  'Июл',  'Авг',     'Сен',       'Окт',     'Ноя',      'Дек'];
