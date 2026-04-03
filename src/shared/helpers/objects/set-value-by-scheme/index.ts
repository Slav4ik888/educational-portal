
type Obj = {
  [key: string]: any
}

/**
 * Set into Obj value in object by scheme
 * max вложенность не ограничена
 * Особенности работы:
 *  - Создание промежуточных структур - если какого-то пути не существует, функция создаст нужные объекты/массивы
 *  - Безопасная работа с массивами - проверяет что текущий элемент действительно массив и что индекс в допустимых границах
 *  - Возвращает boolean - true если значение успешно установлено, false если произошла ошибка
 *  - Поддержка всех случаев:
 *  - Обычные поля объектов (obj.field)
 *  - Элементы массивов (obj.array.[0])
 *  - Поддерживает оба формата записи массивов: 'array[0]' и 'array.[0]'
 *  - Комбинации (obj.field.array.[0].subfield)
 * v.2025-07-05
 */
export function setValueByScheme(obj: Obj | undefined, scheme: string, value: any) {
  if (! obj || ! scheme) return false;

  // Улучшенное разбиение пути, обрабатывающее оба формата
  const fields = scheme.split(/(?<!\\)\.|\[|\]/).filter(part => part !== '');
  let current = obj;

  for (let i = 0; i < fields.length - 1; i++) {
    const field = fields[i];
    let isArrayIndex = false;
    let index = 0;

    // Проверяем, является ли следующий элемент индексом массива
    if (i + 1 < fields.length && fields[i + 1] === '') {
      // Формат array.[0] - текущий field это имя массива, следующий это индекс
      isArrayIndex = true;
      index = parseInt(fields[i + 2], 10);
      i += 2; // Пропускаем следующие два элемента (пустую строку и индекс)
    } else if (/^\d+$/.test(field)) {
      // Формат array[0] - текущий field это индекс
      isArrayIndex = true;
      index = parseInt(field, 10);
    }

    if (isArrayIndex) {
      // Обработка массива
      if (!Array.isArray(current)) return false;
      if (index < 0 || index > current.length) return false;

      if (index === current.length) {
        const nextField = fields[i + 1];
        current.push(/^\d+$/.test(nextField) ? [] : {});
      }
      current = current[index];
    } else {
      // Обработка объекта
      if (current[field] === undefined) {
        const nextField = fields[i + 1];
        current[field] = (nextField === '' || /^\d+$/.test(nextField)) ? [] : {};
      }
      current = current[field];
    }
  }

  // Устанавливаем значение в последнее поле
  const lastField = fields[fields.length - 1];
  const isLastArray = /^\d+$/.test(lastField);

  if (isLastArray) {
    // Установка значения в массив
    const index = parseInt(lastField, 10);
    if (!Array.isArray(current)) return false;
    if (index < 0 || index > current.length) return false;

    if (index === current.length) {
      current.push(value);
    } else {
      current[index] = value;
    }
  } else {
    // Установка значения в объект
    current[lastField] = value;
  }

  return true;
}
