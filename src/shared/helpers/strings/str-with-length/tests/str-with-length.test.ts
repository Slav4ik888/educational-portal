import { Mocks } from './types';
import { strWithLength } from '..';

const mocks: Mocks = [
  [{ str: '12345',   length: 10 },        '12345     '],
  [{ str: '12345',   length: 5 },         '12345'],
  [{ str: '12345',   length: 2 },         '12'],
  [{ str: {},        length: 2 },         {} as unknown as string],
  // @ts-ignore
  [{ str: undefined, length: 2 },         undefined as string],
  // @ts-ignore
  [{ str: null,      length: 2 },         null as string],
  [{ str: '',        length: 2 },         '' as string],
  [{ str: '12345',   length: 0 },         ''],
  [{ str: '12345',   length: undefined }, ''],
  [{ str: '12345',   length: false },     ''],
  [{ str: '12345',   length: true },      '']
];



describe('strWithLength', () => {
  mocks.forEach((m, i) => {
    const description = `${strWithLength(`[${String(m[0].str)}]`, 15)}result: "${m[1]}"`;

    it(description, () => expect(strWithLength(m[0].str, m[0].length)).toEqual(m[1]))
  })
});

// npm run test str-with-length.test.ts
