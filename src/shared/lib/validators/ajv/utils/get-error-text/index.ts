/* eslint-disable */
import cfg from 'app/config';
import { showIfNotUndefined } from '../../../../../helpers/strings';
import { ERROR_NAME } from './error-text';

export { ERROR_NAME };



/** v.2024-01-12 */
export const getErrorText = (
  errorName  : ERROR_NAME,
  fieldName? : string, // Field name
  value?     : string  // Field value
): string => {
  switch (errorName) {
    case ERROR_NAME.MUST_BE_ONE_OF_SEVERAL:  return `Поле${showIfNotUndefined(fieldName, ' "###"')} не является одним из допустимых значений.`
    case ERROR_NAME.ADDITIONAL_PROPERTIES:   return `Присутствует недопустимое поле${showIfNotUndefined(fieldName, ' "###"')}.`
    case ERROR_NAME.REQUIRED:                return `Отсутствует обязательное поле${showIfNotUndefined(fieldName, ' "###"')}.`
    case ERROR_NAME.CONSTANT:                return `Значение в поле ${showIfNotUndefined(fieldName, ' "###"')}, не соответствует ожидаемому значению${showIfNotUndefined(value, ': "###"')}.`

    case ERROR_NAME.MUST_NOT_BE_EMPTY:       return `Поле${showIfNotUndefined(fieldName, ' "###"')} не должно быть пустым.`

    case ERROR_NAME.MAX_ITEMS:               return `Массив${showIfNotUndefined(fieldName, ' "###"')} не должен быть больше${showIfNotUndefined(value, ' ###')} элементов.`

    case ERROR_NAME.STR_LESS_THAN:           return `Поле${showIfNotUndefined(fieldName, ' "###"')} не должно быть меньше${showIfNotUndefined(value, ' ###')} символов.`
    case ERROR_NAME.STR_MORE_THAN:           return `Поле${showIfNotUndefined(fieldName, ' "###"')} не должно быть больше${showIfNotUndefined(value, ' ###')} символов.`

    case ERROR_NAME.NUM_LESS_THAN:           return `Поле${showIfNotUndefined(fieldName, ' "###"')} не должно быть меньше${showIfNotUndefined(value, ' ###')}.`
    case ERROR_NAME.NUM_MORE_THAN:           return `Поле${showIfNotUndefined(fieldName, ' "###"')} не должно быть больше${showIfNotUndefined(value, ' ###')}.`

    case ERROR_NAME.INVALID_DATA:            return `Не корректные данные${showIfNotUndefined(fieldName, ', для поля "###"')}.`;
    case ERROR_NAME.INVALID_FORMAT:          return `Не верный формат данных${showIfNotUndefined(fieldName, ', для поля "###"')}.`;
    case ERROR_NAME.INVALID_ONE_OF:          return `Не соответствует допустимым значениям${showIfNotUndefined(fieldName, ', для поля "###"')}.`;

    case ERROR_NAME.PASSWORD_NOT_EQUAL_CONF: return 'Значение в поле "Повторите пароль", не совпадает с введёным паролем';
    case ERROR_NAME.PERMISSONS_NOT_ALLOWED:  return 'Нет разрешения на данную операцию';
    case ERROR_NAME.PERMISSONS_UNKNOWN:      return 'Не допустимый тип разрешения';

    case ERROR_NAME.PERMISSONS_DISABLED:     return 'Для регистрации, необходимо предоставить согласие на обработку персональных данных';
    case ERROR_NAME.ITN:                     return 'ИНН должен состоять из 10 или 12 цифр.';

    case ERROR_NAME.MAX_FILE_SIZE:           return `Превышен допустимый размер файла - ${cfg.UPLOAD.MAX_FILE_SIZE / (1024 * 1024)}Mb.`;
    case ERROR_NAME.MAX_TOTAL_FILE_SIZE:     return `Превышен допустимый общий размер файлов - ${cfg.UPLOAD.MAX_TOTAL_FILE_SIZE / (1024 * 1024)}Mb.`;

    default: return `Не предусмотренная ошибка${showIfNotUndefined(errorName, ' "###"')}.`
  }
}
