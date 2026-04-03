import { getRest } from '..';


describe('getRest', () => {
  test('value is undefined', () => expect(getRest(undefined)).toEqual(undefined));
  test('value is NaN', () => expect(getRest(NaN)).toEqual(undefined));
  test('value is 0', () => expect(getRest(0)).toEqual(0));


  test('value is 123', () => expect(getRest(123)).toEqual(0));
  test('value is 123.456', () => expect(getRest(123.456)).toEqual(456));
  test('value is .456', () => expect(getRest(0.456)).toEqual(456));
});

// npm run test:unit get-rest.test.ts
