import { capitalizeFirst } from '..';


describe('capitalizeFirst', () => {
  // invalid
  test('undefined', () => {
    expect(capitalizeFirst(undefined as unknown as string)).toEqual('');
  });
  test('false', () => {
    expect(capitalizeFirst(false as unknown as string)).toEqual('');
  });
  test('true', () => {
    expect(capitalizeFirst(true as unknown as string)).toEqual('');
  });
  test('123', () => {
    expect(capitalizeFirst(123 as unknown as string)).toEqual('');
  });

  // valid
  test('All', () => {
    expect(capitalizeFirst('capitalizeFirst')).toEqual('CapitalizeFirst');
  });
});

// npm run test:unit capitalize-first.test.ts
