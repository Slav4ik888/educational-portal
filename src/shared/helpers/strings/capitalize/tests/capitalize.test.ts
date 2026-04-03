import { capitalize } from '..';


describe('capitalize', () => {
  // invalid
  test('undefined', () => {
    expect(capitalize(undefined as unknown as string)).toEqual(undefined);
  });
  test('false', () => {
    expect(capitalize(false as unknown as string)).toEqual(false);
  });
  test('true', () => {
    expect(capitalize(true as unknown as string)).toEqual(true);
  });
  test('123', () => {
    expect(capitalize(123 as unknown as string)).toEqual(123);
  });

  // valid
  test('All', () => {
    expect(capitalize('capitalize')).toEqual('CAPITALIZE');
  });

  test('First char', () => {
    expect(capitalize('capitalize', { first: true })).toEqual('Capitalize');
  });
  test('Empty char', () => {
    expect(capitalize('', { first: true })).toEqual('');
  });
});

// npm run test:unit capitalize.test.ts
