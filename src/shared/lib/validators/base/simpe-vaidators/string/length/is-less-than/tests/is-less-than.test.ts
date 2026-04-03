import { getMockStrLength } from 'shared/helpers/strings';
import { isLessThan, isNotLessThan } from '..';


describe('isLessThan', () => {
  test('Less', () => {
    expect(isLessThan(getMockStrLength(999), 1000)).toEqual(true);
  });

  test('Not less (equal)', () => {
    expect(isLessThan(getMockStrLength(1000), 1000)).toEqual(false);
  });

  test('Not less', () => {
    expect(isLessThan(getMockStrLength(1001), 1000)).toEqual(false);
  });
});

describe('isNotLessThan', () => {
  test('Not less (equal)', () => {
    expect(isNotLessThan(getMockStrLength(1000), 1000)).toEqual(true);
  });

  test('Not less', () => {
    expect(isNotLessThan(getMockStrLength(1001), 1000)).toEqual(true);
  });

  test('Less', () => {
    expect(isNotLessThan(getMockStrLength(999), 1000)).toEqual(false);
  });
});

// npm run test:unit is-less-than.test.ts
