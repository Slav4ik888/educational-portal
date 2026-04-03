import { boolToNumber } from '..';
import { Mocks } from './types';


const mocks: Mocks = [
  [NaN, 0], [undefined, 0], [0, 0], [false, 0], ['', 0],
  [1, 1], ['1', 1], [true, 1], ['slava', 1]
];



describe('boolToNumber', () => {
  mocks.forEach((m, i) => it(`${i + 1}`, () => {
    expect(boolToNumber(m[0])).toEqual(m[1]);
  }))
});


// npm run test bool-to-number.test.ts
