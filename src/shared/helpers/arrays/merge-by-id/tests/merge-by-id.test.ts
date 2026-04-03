import { mergeById } from '..';



describe('mergeById', () => {
  interface TestItem {
    id: string;
    name?: string;
    age?: number;
    active?: boolean;
  }

  test('should merge two empty arrays', () => {
    const result = mergeById<TestItem>([], []);
    expect(result).toEqual([]);
  });

  test('should merge when first array is empty', () => {
    const array2: TestItem[] = [
      { id: '1', name: 'Alice' },
      { id: '2', age: 25 }
    ];

    const result = mergeById<TestItem>([], array2);
    expect(result).toEqual(array2);
  });

  test('should merge when second array is empty', () => {
    const array1: TestItem[] = [
      { id: '1', name: 'Alice' },
      { id: '2', age: 25 }
    ];

    const result = mergeById<TestItem>(array1, []);
    expect(result).toEqual(array1);
  });

  test('should merge arrays with unique ids', () => {
    const array1: TestItem[] = [
      { id: '1', name: 'Alice' }
    ];
    const array2: TestItem[] = [
      { id: '2', age: 25 }
    ];

    const result = mergeById(array1, array2);
    expect(result).toEqual([
      { id: '1', name: 'Alice' },
      { id: '2', age: 25 }
    ]);
  });

  test('should update existing items', () => {
    const array1: TestItem[] = [
      { id: '1', name: 'Alice', age: 20 },
      { id: '2', name: 'Bob' }
    ];
    const array2: TestItem[] = [
      { id: '1', age: 25 },
      { id: '2', active: true }
    ];

    const result = mergeById(array1, array2);
    expect(result).toEqual([
      { id: '1', name: 'Alice', age: 25 },
      { id: '2', name: 'Bob', active: true }
    ]);
  });

  test('should handle complex merging', () => {
    const array1: TestItem[] = [
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob', age: 30 },
      { id: '3', active: false }
    ];
    const array2: TestItem[] = [
      { id: '2', age: 35, active: true },
      { id: '4', name: 'Charlie' }
    ];

    const result = mergeById(array1, array2);
    expect(result).toEqual([
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob', age: 35, active: true },
      { id: '3', active: false },
      { id: '4', name: 'Charlie' }
    ]);
  });

  test('should not mutate input arrays', () => {
    const array1: TestItem[] = [{ id: '1', name: 'Original' }];
    const array2: TestItem[] = [{ id: '1', name: 'Updated' }];

    const array1Before = [...array1];
    const array2Before = [...array2];

    mergeById(array1, array2);

    expect(array1).toEqual(array1Before);
    expect(array2).toEqual(array2Before);
  });

  test('should preserve object references when no updates', () => {
    const item1 = { id: '1', name: 'Alice' };
    const item2 = { id: '2', name: 'Bob' };

    const array1: TestItem[] = [item1, item2];
    const array2: TestItem[] = [{ id: '3', name: 'Charlie' }];

    const result = mergeById(array1, array2);

    // Проверяем что неизмененные объекты сохранили ссылки
    expect(result[0]).toBe(item1);
    expect(result[1]).toBe(item2);
  });

  test('should handle large arrays efficiently', () => {
    const array1 = Array(1000).fill(null).map((_, i) => ({
      id: `id-${i}`,
      value: i
    }));

    const array2 = Array(1000).fill(null).map((_, i) => ({
      id: `id-${i}`,
      value: i * 2
    }));

    const startTime = performance.now();
    const result = mergeById(array1, array2);
    const duration = performance.now() - startTime;

    expect(result.length).toBe(1000);
    expect(result[999].value).toBe(999 * 2);
    expect(duration).toBeLessThan(100); // Должно выполняться быстро (<100ms)
  });


  describe('mergeById edge cases', () => {
    test('should handle undefined/null inputs', () => {
      expect(mergeById(undefined as any, [])).toEqual([]);
      expect(mergeById(null as any, [])).toEqual([]);
      expect(mergeById([], undefined as any)).toEqual([]);
      expect(mergeById([], null as any)).toEqual([]);
    });

    test('should handle items without id property', () => {
      const array1 = [{ id: '1' }, { noId: true } as any];
      const array2 = [{ id: '2' }];

      const result = mergeById(array1, array2);
      expect(result).toEqual([{ id: '1' }, { noId: true }, { id: '2' }]);
    });

    test('should handle duplicate ids within one array', () => {
      const array1 = [
        { id: '1', name: 'First' },
        { id: '1', name: 'Duplicate' }
      ];
      const array2 = [{ id: '2', name: 'Second' }];

      const result = mergeById(array1, array2);
      // Должен взять последнее значение для дубликатов
      expect(result).toEqual([
        { id: '1', name: 'Duplicate' },
        { id: '2', name: 'Second' }
      ]);
    });
  });
});

// npm run test:unit merge-by-id.test.ts
