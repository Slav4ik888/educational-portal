import { getArrWithoutArr } from '..';



describe('getArrWithoutArr', () => {
  // Базовые случаи
  it('should return original array when second array is empty', () => {
    const arr = [{ id: '1' }, { id: '2' }];
    const arr2: typeof arr = [];
    expect(getArrWithoutArr(arr, arr2)).toEqual(arr);
  });

  it('should return original array when second array is not provided', () => {
    const arr = [{ id: '1' }, { id: '2' }];
    expect(getArrWithoutArr(arr, undefined as any)).toEqual(arr);
  });

  it('should return empty array when first array is empty', () => {
    const arr: { id: string }[] = [];
    const arr2 = [{ id: '1' }];
    expect(getArrWithoutArr(arr, arr2)).toEqual([]);
  });

  it('should return empty array when first array is not provided', () => {
    const arr2 = [{ id: '1' }];
    expect(getArrWithoutArr(undefined as any, arr2)).toEqual(undefined as any);
  });

  // Основная логика
  it('should filter out items that exist in second array by id', () => {
    const arr = [{ id: '1' }, { id: '2' }, { id: '3' }];
    const arr2 = [{ id: '2' }, { id: '3' }];
    const expected = [{ id: '1' }];
    expect(getArrWithoutArr(arr, arr2)).toEqual(expected);
  });

  it('should return full array when no matches found', () => {
    const arr = [{ id: '1' }, { id: '2' }];
    const arr2 = [{ id: '3' }, { id: '4' }];
    expect(getArrWithoutArr(arr, arr2)).toEqual(arr);
  });

  // Крайние случаи
  it('should handle arrays with duplicate ids correctly', () => {
    const arr = [{ id: '1' }, { id: '1' }, { id: '2' }];
    const arr2 = [{ id: '1' }];
    const expected = [{ id: '2' }];
    expect(getArrWithoutArr(arr, arr2)).toEqual(expected);
  });

  it('should return empty array when all items are filtered out', () => {
    const arr = [{ id: '1' }, { id: '2' }];
    const arr2 = [{ id: '1' }, { id: '2' }];
    expect(getArrWithoutArr(arr, arr2)).toEqual([]);
  });

  // Проверка на иммутабельность
  it('should not modify original arrays', () => {
    const arr = [{ id: '1' }, { id: '2' }];
    const arr2 = [{ id: '2' }];
    const arrCopy = [...arr];
    const arr2Copy = [...arr2];

    getArrWithoutArr(arr, arr2);

    expect(arr).toEqual(arrCopy);
    expect(arr2).toEqual(arr2Copy);
  });
});

// npm run test:unit get-arr-without-arr.test.ts
