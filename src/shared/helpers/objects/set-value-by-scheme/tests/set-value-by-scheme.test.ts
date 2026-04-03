import { setValueByScheme } from '..';
import { cloneObj } from '../../objects';

const MOCK = {
  first: {
    second: {
      third: {
        fourth: {
          fifth: {
            sixs: {
              sevens: {
                eights: {
                  field: 'some field'
                }
              },
              any: {
                any: {}
              }
            }
          },
          any: {
            any: {}
          }
        }
      }
    },
    any: {
      any: {}
    }
  },
  any: {
    any: {}
  }
};



describe('setValueByScheme', () => {
  test('Set to nesting depth 4', () => {
    const CLONE_MOCK = cloneObj(MOCK);
    setValueByScheme(CLONE_MOCK, 'first.second.third.fourth', { newField: '123 ' })
    expect(CLONE_MOCK.first.second.third.fourth).toEqual({ newField: '123 ' });
  });

  test('Set to nesting depth 4 without fields by scheme', () => {
    const CLONE_MOCK = cloneObj(MOCK);
    setValueByScheme(CLONE_MOCK, 'non_first.non_second.non_third.non_fourth', { newField: '123 ' });

    // @ts-ignore
    expect(CLONE_MOCK.first.second.third.fourth.any).toEqual({ any: {} });
    // @ts-ignore
    expect(CLONE_MOCK.non_first.non_second.non_third.non_fourth).toEqual({ newField: '123 ' });
  });

  test('Set to nesting depth 8 without first field by scheme', () => {
    const CLONE_MOCK = cloneObj(MOCK);
    setValueByScheme(CLONE_MOCK, 'non_first.second.third.fourth.fifth.sixs.sevens.eights', { newField: '123 ' });

    // @ts-ignore
    expect(CLONE_MOCK.first.second.third.fourth.any).toEqual({ any: {} });
    // @ts-ignore
    expect(CLONE_MOCK.non_first.second.third.fourth.fifth.sixs.sevens.eights).toEqual({ newField: '123 ' });
  });


  test('Set to nesting depth 8 without 4 field by scheme', () => {
    const CLONE_MOCK = cloneObj(MOCK);
    setValueByScheme(CLONE_MOCK, 'first.second.third.non_fourth.fifth.sixs.sevens.eights', { newField: '123 ' });

    // @ts-ignore
    expect(CLONE_MOCK.first.second.third.fourth.any).toEqual({ any: {} })
    // @ts-ignore
    expect(CLONE_MOCK.first.second.third.non_fourth.fifth.sixs.sevens.eights).toEqual({ newField: '123 ' });
  });

  // With array & some test from DeepSeek
  const data = {
    user: {
      name: 'John',
      hobbies: [
        { type: 'sport', name: 'football' },
        { type: 'music', name: 'guitar' }
      ],
      friends: []
    }
  };

  test('Изменение простого поля', () => {
    const CLONE_MOCK = cloneObj(data);
    setValueByScheme(CLONE_MOCK, 'user.name', 'Mike');
    expect(CLONE_MOCK.user.name).toEqual('Mike');
  });

  test('Изменение вложенного объекта в массиве', () => {
    const CLONE_MOCK = cloneObj(data);
    setValueByScheme(CLONE_MOCK, 'user.hobbies.[0].name', 'basketball');
    expect(CLONE_MOCK.user.hobbies[0].name).toEqual('basketball');
    expect(CLONE_MOCK.user.hobbies[0].type).toEqual('sport');
    // не тронутый объект не должен быть изменен
    expect(CLONE_MOCK.user.hobbies[1]).toEqual({ type: 'music', name: 'guitar' });
  });

  test('Добавление нового поля', () => {
    const CLONE_MOCK = cloneObj(data);
    setValueByScheme(CLONE_MOCK, 'user.age', 30);
    // @ts-ignore
    expect(CLONE_MOCK.user.age).toEqual(30);
  });

  test('Добавление элемента в массив', () => {
    const CLONE_MOCK = cloneObj(data);
    setValueByScheme(CLONE_MOCK, 'user.friends.[0]', 'David');
    expect(CLONE_MOCK.user.friends[0]).toEqual('David');
  });

  test('Создание новой структуры', () => {
    const CLONE_MOCK = cloneObj(data);
    setValueByScheme(CLONE_MOCK, 'user.address.city', 'New York');
    // @ts-ignore
    expect(CLONE_MOCK.user.address.city).toEqual('New York');
  });

  test('Создание новой структуры с добавление массива в массив', () => {
    const CLONE_MOCK = cloneObj(data);
    setValueByScheme(CLONE_MOCK, 'user.hobbies.[2].families.[0]', { city: 'New York', family: ['Sandy', 'Garry'] });
    // @ts-ignore
    expect(CLONE_MOCK.user.hobbies[2].families[0].family[1]).toEqual('Garry');
    setValueByScheme(CLONE_MOCK, 'user.hobbies.[2].families.[0].family.[1]', 'Lizzy');
    // @ts-ignore
    expect(CLONE_MOCK.user.hobbies[2].families[0].family[1]).toEqual('Lizzy');
  });

  it('должен работать с форматом array[0]', () => {
    const obj = {};
    const result = setValueByScheme(obj, 'items[0].name', 'John');
    expect(result).toBe(true);
    // @ts-ignore
    expect(obj.items[0].name).toBe('John');
  });

  it('должен работать с форматом array.[0]', () => {
    const obj = {};
    const result = setValueByScheme(obj, 'items.[0].name', 'John');
    expect(result).toBe(true);
    // @ts-ignore
    expect(obj.items[0].name).toBe('John');
  });

  it('должен работать со смешанными форматами', () => {
    const obj = {};
    const result1 = setValueByScheme(obj, 'data[0].users.[0].name', 'Alice');
    const result2 = setValueByScheme(obj, 'data.[1].users[0].name', 'Bob');

    expect(result1).toBe(true);
    expect(result2).toBe(true);
    // @ts-ignore
    expect(obj.data[0].users[0].name).toBe('Alice');
    // @ts-ignore
    expect(obj.data[1].users[0].name).toBe('Bob');
  });
});

// npm run test:unit set-value-by-scheme.test.ts
