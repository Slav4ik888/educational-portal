import { withZero } from '.';


const mocks = [
  [undefined, '00'],
  [null, '00'],
  [0, '00'],
  ['-', '0-'],
  ['2022-01-01', '01'],
  ['1', '01'],
];


describe('withZero', () => {
  mocks.forEach(m => it(`${m[0]}`, () => expect(withZero(m[0] as string | number))
    .toEqual(m[1])))
});

// npm run test:unit with-zero.test.ts
