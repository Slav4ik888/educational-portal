import { isItemInArr } from '..';
import { Mocks } from './types';


const mocks: Mocks = [
  [{ arr: NaN,         item: '1' },          false],
  [{ arr: undefined,   item: '1' },          false],
  [{ arr: null,        item: '1' },          false],
  [{ arr: [],          item: '1' },          false],
  [{ arr: [],          item: undefined },    false],
  [{ arr: {},          item: '1' },          false],
  [{ arr: { it: '1' }, item: { it: '1' } },  false],
  [{ arr: {},          item: undefined },    false],
  [{ arr: ['1'],       item: '1' },          true],

  [{ arr: ['1', '2', '3', '4'], item: '2' }, true],
  [{ arr: ['1', '2', '3', '4'], item: '3' }, true],
  [{ arr: ['1', '2', '3', '4'], item: '4' }, true],
  [{ arr: ['1', '2', '3', '4'], item: '5' }, false],

  [{ arr: [{ it: '1' }, '2', { it: '3' }, '4'], item: { it: '3' } }, false],
  [{ arr: [{ it: '1' }, '2', { it: '3' }, '4'], item: { it: 3 } },   false],

  [{ arr: [false],       item: false }, false],
  [{ arr: [true, false], item: false }, false],
  [{ arr: [true],        item: false }, false],
]

describe('isItemInArr', () => {
  mocks.forEach((m, i) => {
    it(`${i + 1}`, () => {
      expect(isItemInArr(m[0].arr, m[0].item)).toEqual(m[1])
    })
  })
})

// npm run test is-item-in-arr.test.ts
