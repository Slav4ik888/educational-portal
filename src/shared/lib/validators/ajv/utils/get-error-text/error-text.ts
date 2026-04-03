export enum ERROR_NAME {
  MUST_BE_ONE_OF_SEVERAL  = 'MUST_BE_ONE_OF_SEVERAL',
  ADDITIONAL_PROPERTIES   = 'ADDITIONAL_PROPERTIES',
  INVALID_DATA            = 'INVALID_DATA',            // Не корректные данные
  INVALID_FORMAT          = 'INVALID_FORMAT',          // Не верный формат данных
  INVALID_ONE_OF          = 'INVALID_ONE_OF',          // Не соответствует допустимым значениям

  REQUIRED                = 'REQUIRED',                // Отсутствует обязательное поле
  CONSTANT                = 'CONSTANT',                // Значение в поле "__", не соответствует ожидаемому значение
  MUST_NOT_BE_EMPTY       = 'MUST_NOT_BE_EMPTY',

  MAX_ITEMS               = 'MAX_ITEMS',               // Массив "" не должен быть больше Х элементов
  STR_LESS_THAN           = 'STR_LESS_THAN',           // Строка меньше минимальной длины
  STR_MORE_THAN           = 'STR_MORE_THAN',           // Строка больше максимальной длины

  NUM_LESS_THAN           = 'NUM_LESS_THAN',           // Меньше минимального значения
  NUM_MORE_THAN           = 'NUM_MORE_THAN',           // Больше максимального значения

  PASSWORD_NOT_EQUAL_CONF = 'PASSWORD_NOT_EQUAL_CONF', // Значение в поле "Подтверждение пароля", не совпадает с введёным паролем
  PERMISSONS_NOT_ALLOWED  = 'PERMISSONS_NOT_ALLOWED',  // Нет разрешения на данную операцию
  PERMISSONS_UNKNOWN      = 'PERMISSONS_UNKNOWN',      // Не допустимый тип разрешения
  PERMISSONS_DISABLED     = 'PERMISSONS_DISABLED',     // Для регистрации, необходимо предоставить согласие на обработку персональных данных
  ITN                     = 'ITN',

  MAX_FILE_SIZE           = 'MAX_FILE_SIZE',       // Превышен допустимый размер файла - ${cfg.UPLOAD.MAX_FILE_SIZE / (1024 * 1024)}Mb.
  MAX_TOTAL_FILE_SIZE     = 'MAX_TOTAL_FILE_SIZE'  // Превышен допустимый общий размер файлов - ${cfg.UPLOAD.MAX_TOTAL_FILE_SIZE / (1024 * 1024)}Mb.
}

  // EMAIL_EMPTY              = 'Поле email не должно быть пустым',
  // EMAIL_INVALID            = 'Введён не корректный email',

  // PASSWORD_EMPTY           = 'Поле пароль" не должно быть пустым',
  // PASSWORD_MIN_L           = 'Пароль должен содержать более 5 символов',

  // USER_USERID_NOT_STRING     = 'Поле userId должно быть строкой',
  // USER_ID_REQUIRED           = 'Отсутствует обязательное поле userId',
  // USER_ID_EMPTY              = 'Поле userId не должно быть пустым',
  // USER_ID_LENGTH             = 'Поле userId должен содержать 28 символов',
  // USER_COMPANYID_NOT_STRING  = 'Поле companyId должно быть строкой',

  // COMMENT_EMPTY               = 'Объект с комментарием пустой',
  // COMMENT_NOT_CREATE_FROM_ANY = 'Нельзя создавать комментарий от имени другого пользователя',
  // COMMENT_INVALID_MESSAGE_L   = 'Сообщение должно быть меньше 500 символов',

  // MUST_BE_LENGTH        = 'Строка не корректной длины',


  // INVALID_DATA          = 'Некорректные данные',
  // NOT_BE_UNDEFINED      = 'Поле не может быть undefined',
