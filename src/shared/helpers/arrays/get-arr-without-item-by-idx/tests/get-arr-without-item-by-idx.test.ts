import { getArrWithoutItemByIndex } from '..';


describe('getArrWithoutItemByIndex', () => {
  it('should return a new array without the element at the given index', () => {
    const items = [1, 2, 3, 4, 5];
    const index = 2;
    const result = getArrWithoutItemByIndex(items, index);
    expect(result).toEqual([1, 2, 4, 5]);
  });

  it('should return the original array when invalid input is provided', () => {
    const items = [1, 2, 3, 4, 5];
    const index = 10;
    const result = getArrWithoutItemByIndex(items, index);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('should handle invalid index type', () => {
    const items = [1, 2, 3, 4, 5];
    const index = 'a' as unknown as number;
    const result = getArrWithoutItemByIndex(items, index);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('should handle negative index', () => {
    const items = [1, 2, 3, 4, 5];
    const index = -1;
    const result = getArrWithoutItemByIndex(items, index);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('should handle out-of-bounds index', () => {
    const items = [1, 2, 3, 4, 5];
    const index = 10;
    const result = getArrWithoutItemByIndex(items, index);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('should handle non-integer index', () => {
    const items = [1, 2, 3, 4, 5];
    const index = 1.5;
    const result = getArrWithoutItemByIndex(items, index);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('should handle undefined index', () => {
    const items = [1, 2, 3, 4, 5];
    const index = undefined;
    const result = getArrWithoutItemByIndex(items, index as unknown as number);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('should handle null index', () => {
    const items = [1, 2, 3, 4, 5];
    const index = null;
    const result = getArrWithoutItemByIndex(items, index as unknown as number);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('should handle Infinity index', () => {
    const items = [1, 2, 3, 4, 5];
    const index = Infinity;
    const result = getArrWithoutItemByIndex(items, index);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('should handle NaN index', () => {
    const items = [1, 2, 3, 4, 5];
    const index = NaN;
    const result = getArrWithoutItemByIndex(items, index);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('should handle non-array input', () => {
    const items = 123;
    const index = 0;
    const result = getArrWithoutItemByIndex(items as unknown as [], index);
    expect(result).toEqual(123);
  });
});

// npm run test:unit get-arr-without-item-by-idx.test.ts
