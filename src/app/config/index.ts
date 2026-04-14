import { sec } from 'shared/helpers/dates'

export const cfg = {
  VERSION                 : '1.0.0',
  ASSEMBLY_DATE           : '2026-04-14',

  COOKIE_NAME             : 'education-portal',
  DEFAULT_MESSAGE_TIMEOUT : sec(6),

  UPLOAD: {
    MAX_FILE_SIZE       : 3  * 1024 * 1024, // 3Mb
    MAX_TOTAL_FILE_SIZE : 12 * 1024 * 1024  // 12Mb
  },

  // DEV
  /** If checks should been disabled */
  IS_EXPERIMENTAL : false,

  // TODO: set IS_DEV = false before PRODUCTION
  IS_DEV          : false,
  // SET_ANSWERS     : true, // По умолчанию расставить верные ответы
}
