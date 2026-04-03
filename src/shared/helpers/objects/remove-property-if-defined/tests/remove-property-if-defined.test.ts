import { removePropertyIfDefined } from '..';


describe('removePropertyIfDefined', () => {
  let testObj: Record<string, any>;

  beforeEach(() => {
    testObj = {
      settings: {
        chartOptions: {
          scales: {
            y: { min: 0, max: 100 },
            x: { min: 10 }
          }
        },
        items: [
          { id: 1, value: 'foo' },
          { id: 2, value: 'bar' }
        ]
      }
    };
  });

  it('удаляет свойство в объекте', () => {
    const result = removePropertyIfDefined(testObj, 'settings.chartOptions.scales.y.min');
    expect(result).toBe(true);
    expect(testObj.settings.chartOptions.scales.y.min).toBeUndefined();
  });

  it('не удаляет свойство, если оно undefined', () => {
    const result = removePropertyIfDefined(testObj, 'settings.chartOptions.scales.y.unknown');
    expect(result).toBe(false);
  });

  it('удаляет свойство в массиве', () => {
    const result = removePropertyIfDefined(testObj, 'settings.items[0].value');
    expect(result).toBe(true);
    expect(testObj.settings.items[0].value).toBeUndefined();
  });

  it('не удаляет, если индекс массива не существует', () => {
    const result = removePropertyIfDefined(testObj, 'settings.items[99].value');
    expect(result).toBe(false);
  });

  it('не удаляет, если путь содержит несуществующее свойство', () => {
    const result = removePropertyIfDefined(testObj, 'settings.invalid.path');
    expect(result).toBe(false);
  });

  it('работает с вложенными массивами', () => {
    testObj.nested = { arr: [[{ prop: 'value' }]] };
    const result = removePropertyIfDefined(testObj, 'nested.arr[0][0].prop');
    expect(result).toBe(true);
    expect(testObj.nested.arr[0][0].prop).toBeUndefined();
  });

  it('не ломает исходный объект при неудачном удалении', () => {
    const snapshot = JSON.parse(JSON.stringify(testObj));
    removePropertyIfDefined(testObj, 'invalid.path');
    expect(testObj).toEqual(snapshot);
  });
});

// npm run test:unit remove-property-if-defined.test.ts
