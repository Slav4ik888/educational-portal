import { modifyNestedProperty } from '..';
import { isArr, isStr } from 'shared/lib/validators';



describe('modifyNestedProperty', () => {
  let testItem: any;

  beforeEach(() => {
    testItem = {
      id: 'test-item',
      type: 'box',
      settings: {
        chartOptions: {
          scales: {
            y: { min: 0, max: 100 },
            // @ts-ignore
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

  it('должен игнорировать пустые объекты', () => {
    const emptyItem = {} as any;
    modifyNestedProperty(emptyItem, ['settings.chartOptions']);
    expect(emptyItem.settings).toBeUndefined();
  });

  it('должен удалять свойство по строковому пути (Option как string)', () => {
    modifyNestedProperty(testItem, ['settings.chartOptions.scales.y.min']);
    // @ts-ignore
    expect(testItem.settings?.chartOptions?.scales?.y.min).toBeUndefined();
    // @ts-ignore
    expect(testItem.settings?.chartOptions?.scales?.y.max).toBe(100);
  });

  it('должен устанавливать значение по OptionArray', () => {
    modifyNestedProperty(testItem, [['settings.chartOptions.scales.y.min', 50]]);
    // @ts-ignore
    expect(testItem.settings?.chartOptions?.scales?.y.min).toBe(50);
  });

  it('должен обрабатывать смешанные варианты Option', () => {
    modifyNestedProperty(testItem, [
      'settings.chartOptions.scales.y.max', // Удалить
      ['settings.chartOptions.scales.y.min', 20], // Установить
      'settings.items[0].value' // Удалить
    ]);

    // @ts-ignore
    expect(testItem.settings?.chartOptions?.scales?.y.max).toBeUndefined();
    // @ts-ignore
    expect(testItem.settings?.chartOptions?.scales?.y.min).toBe(20);
    // @ts-ignore
    expect(testItem.settings?.items?.[0].value).toBeUndefined();
  });

  it('должен корректно работать с массивами', () => {
    modifyNestedProperty(testItem, [
      ['settings.items[1].value', 'updated']
    ]);
    // @ts-ignore
    expect(testItem.settings?.items?.[1].value).toBe('updated');
  });

  it('при удалении должен игнорировать несуществующие пути', () => {
    const snapshot = JSON.parse(JSON.stringify(testItem));
    modifyNestedProperty(testItem, [
      'settings.non.existing.path'
    ]);
    expect(testItem).toEqual(snapshot);
  });

  it('не должен падать при передаче пустого массива options', () => {
    const snapshot = JSON.parse(JSON.stringify(testItem));
    modifyNestedProperty(testItem, []);
    expect(testItem).toEqual(snapshot);
  });

  it('должен корректно обрабатывать вложенные массивы', () => {
    // @ts-ignore
    testItem.settings!.nestedArrays = [[{ prop: 'value' }]];
    // @ts-ignore
    expect(testItem.settings?.nestedArrays?.[0]?.[0]?.prop).not.toBeUndefined();

    modifyNestedProperty(testItem, [
      'settings.nestedArrays[0][0].prop'
    ]);
    // @ts-ignore
    expect(testItem.settings?.nestedArrays?.[0]?.[0]?.prop).toBeUndefined();
  });
});

// Дополнительные тесты для валидаторов
describe('Type guards', () => {
  it('isStr должен корректно определять строки', () => {
    expect(isStr('path')).toBe(true);
    expect(isStr(['path', 123])).toBe(false);
  });

  it('isArr должен корректно определять OptionArray', () => {
    expect(isArr(['path', 123])).toBe(true);
    expect(isArr('path')).toBe(false);
  });
});

// npm run test:unit modify-nested-property.test.ts
