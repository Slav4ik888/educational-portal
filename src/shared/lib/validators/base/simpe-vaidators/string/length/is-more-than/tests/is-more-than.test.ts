import { getMockStrLength } from 'shared/helpers/strings';
import { isMoreThan, isNotMoreThan } from '..';


describe('isMoreThan', () => {
  test('More', () => {
    expect(isMoreThan(getMockStrLength(1001), 1000)).toEqual(true);
  });

  test('Not more (equal)', () => {
    expect(isMoreThan(getMockStrLength(1000), 1000)).toEqual(false);
  });

  test('Not more', () => {
    expect(isMoreThan(getMockStrLength(999), 1000)).toEqual(false);
  });
});

describe('isNotMoreThan', () => {
  test('Not more (equal)', () => {
    expect(isNotMoreThan(getMockStrLength(1000), 1000)).toEqual(true);
  });

  test('Not more', () => {
    expect(isNotMoreThan(getMockStrLength(999), 1000)).toEqual(true);
  });

  test('More', () => {
    expect(isNotMoreThan(getMockStrLength(1001), 1000)).toEqual(false);
  });
});

// npm run test:unit is-more-than.test.ts
