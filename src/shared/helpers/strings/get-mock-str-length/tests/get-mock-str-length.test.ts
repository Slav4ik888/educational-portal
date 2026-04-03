import { Mocks } from './types';
import { getMockStrLength } from '..';

const mocks: Mocks = [
  [{ length: 0  },                     ''],
  [{ length: 1  },                     '_'],
  [{ length: 10 },                     '__________'],
  [{ length: 10, char: '9' },           '9999999999'],
  [{ length: 10, char: '888' },         '8888888888'],
  [{ length: 10, char: {} as string }, '__________'],

];



describe('getMockStrLength', () => {
  mocks.forEach((m, i) => {
    const description = `Length - ${m[0].length}, char: ${m[0].char}`;

    it(description, () => expect(getMockStrLength(m[0].length, m[0].char)).toEqual(m[1]))
  })
});

// npm run test get-mock-str-length.test.ts
