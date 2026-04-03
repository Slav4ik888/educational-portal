import { getDays } from '..';
import { day } from '../..';


describe('getDays', () => {
  test('undefined', () => {
    expect(getDays(undefined as unknown as number)).toEqual(0);
  });

  test('-1', () => {
    expect(getDays(-1)).toEqual(0);
  });

  test('1 day', () => {
    const value = day(1);
    expect(getDays(value)).toEqual(1);
  });

  test('10 days', () => {
    const value = day(10);
    expect(getDays(value)).toEqual(10);
  });

  test('100 days & 1 millisecond', () => {
    const value = day(100) + 1;
    expect(getDays(value)).toEqual(101);
  });
});

// npm run test:unit get-days.test.ts
