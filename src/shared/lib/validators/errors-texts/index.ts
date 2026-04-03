// v.2023-09-17

export enum ErrorText {
  EMAIL_EMPTY             = 'Поле email не должно быть пустым',
  EMAIL_INVALID           = 'Введён не корректный email',

  PASSWORD_EMPTY          = 'Поле пароль" не должно быть пустым',
  PASSWORD_MIN_L          = 'Пароль должен содержать более 5 символов',
  PASSWORD_NOT_EQUAL_CONF = 'Значение в поле подтверждение пароля, не совпадает с введёным паролем',
  // eslint-disable-next-line max-len
  PERMISSONS_DISABLED     = 'Для регистрации, заполните необходимые поля и предоставьте согласие на обработку персональных данных',

  INVALID_FIELD_PRESENT   = 'Присутствует недопустимое поле',

  REG_PROT_CASE_INVALID   = 'Некорректные данные',

  MUST_BE_LENGTH          = 'Строка не корректной длины',
  STR_LESS_THAN           = 'Строка меньше минимальной длины',
  STR_MORE_THAN           = 'Строка больше максимальной длины',

  NUM_LESS_THAN           = 'Меньше минимального значения',
  NUM_MORE_THAN           = 'Больше максимального значения',

  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  INVALID_DATA            = 'Некорректные данные',
  NOT_BE_UNDEFINED        = 'Поле не может быть undefined',
  REQUIRED                = 'Отсутствует обязательное поле',
  NOT_ONE_OF_SEVERAL      = 'Не соответствует ни одному из допустимых значений'
}
