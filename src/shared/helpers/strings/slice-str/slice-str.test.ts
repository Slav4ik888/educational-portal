import { sliceStr } from '.';
import { mSliceStr } from './mocks';


describe('STRINGS - sliceStr', () => {
  mSliceStr.forEach((m) => {
    it(`sliceStr - ${m.describe}`, () => {
      expect(sliceStr(m.maxLength, m.str as string)).toEqual(m.result);
    });
  })
});

// npm run test slice-str.test.ts
