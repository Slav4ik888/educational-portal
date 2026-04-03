export const mSliceStr = [
  {
    maxLength: 20,
    describe: 'строка больше 20 символов',
    str: 'строка больше 20 символов',
    result: 'строка больше 20 сим'
  }, {
    maxLength: 20,
    describe: '---- строка равна 20',
    str: '---- строка равна 20',
    result: '---- строка равна 20'
  }, {
    maxLength: 20,
    describe: '- строка меньше 20',
    str: '- строка меньше 20',
    result: '- строка меньше 20'
  }, {
    maxLength: 20,
    describe: 'пустая строка',
    str: '',
    result: ''
  }, {
    maxLength: 20,
    describe: 'НЕ строка - 2123',
    str: 2123,
    result: '2123'
  }, {
    maxLength: 20,
    describe: 'НЕ строка - > 20 знаков 12345678901234567890123',
    // eslint-disable-next-line
    str: 12345678901234567890123,
    result: '1.2345678901234568e+'
  }, {
    maxLength: 20,
    describe: 'str = undefined',
    str: undefined,
    result: 'undefined'
  }
];
