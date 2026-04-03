import { parse } from '..';
/* eslint-disable */


describe('parse', () => {
  test('str === undefined', () => expect(parse(undefined as unknown as string)).toEqual(''));
  test('str === ""', () => expect(parse('')).toEqual(''));
  test('str === "[]"', () => expect(parse('[]')).toEqual([]));
  test('str === "{\"str\":\"Slava\"}"', () => expect(parse('{"str":"Slava"}')).toEqual({ str:'Slava' }));
});

// npm run test:unit parse.test.ts
