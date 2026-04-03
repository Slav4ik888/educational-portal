import { getMsFromDate } from '.';


const mocks = [
  [undefined, 0],
  [null, 0],
  [0, 0],
  ['2022-01-01', 1640995200000],
  ['Sat Jan 01 2022 19:29:31 GMT+0800 (Иркутск, стандартное время)', 1641036571000],
];


describe('getMsFromDate', () => {
  mocks.forEach(m => it(`${m[0]}`, () => expect(getMsFromDate(m[0] as string | Date))
    .toEqual(m[1])))
});

// npm run test:unit get-ms-from-date.test.ts
