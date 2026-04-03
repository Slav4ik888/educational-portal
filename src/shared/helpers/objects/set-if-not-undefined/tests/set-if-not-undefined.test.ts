import { setIfNotUndefined } from '..';


describe('setIfNotUndefined', () => {
  // 1. Проверка на игнорирование `undefined` значений
  it('should do nothing if value is undefined', () => {
    const obj = { a: 1 };
    setIfNotUndefined(obj, undefined, 'a');
    expect(obj.a).toBe(1); // Значение не изменилось
  });

  // 2. Запись в поле объекта, если значение не `undefined`
  it('should set field in object if value is not undefined', () => {
    const obj = { a: 1 };
    setIfNotUndefined(obj, 42, 'a');
    expect(obj.a).toBe(42); // Значение обновилось
  });

  // 3. Создание нового поля, если его нет в объекте
  it('should add new field to object if it does not exist', () => {
    const obj = { a: 1 } as any;
    setIfNotUndefined(obj, 'newValue', 'b');
    expect(obj.b).toBe('newValue'); // Поле добавлено
  });

  // 4. Игнорирование, если `obj` не объект (и передан `field`)
  it('should do nothing if obj is not an object (and field is provided)', () => {
    const notObj = 'I am a string';
    setIfNotUndefined(notObj, 42, 'a' as any);
    expect(notObj).toBe('I am a string'); // Ничего не изменилось
  });

  // 5. Не изменяет `obj`, если `field` не указан (и `value` не `undefined`)
  it('should do nothing with value if no field is provided', () => {
    const obj: any = { a: 1 };
    setIfNotUndefined(obj, 'replaced');
    expect(obj.a).toBe(1); // Ничего не изменилось
  });

  // 6. Проверка на `null` (не `undefined`)
  it('should handle null as a valid value', () => {
    const obj = { a: 1 };
    setIfNotUndefined(obj, null, 'a');
    expect(obj.a).toBeNull(); // null записался
  });

  // 7. Проверка инициализации поля пустой строкой, если оно `undefined`
  it('should initialize field with empty string if it was undefined', () => {
    const obj = { a: undefined } as any;
    setIfNotUndefined(obj, 'newValue', 'a');
    expect(obj.a).toBe('newValue'); // Поле инициализировано
  });

  // 8.
  it('should set string', () => {
    const str = setIfNotUndefined('string', 'newValue');
    expect(str).toBe('newValue'); // Поле инициализировано
  });
});


// npm run test:unit set-if-not-undefined.test.ts
