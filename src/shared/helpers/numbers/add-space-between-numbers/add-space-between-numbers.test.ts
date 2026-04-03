import { addSpaceBetweenNumbers } from '.'


interface Mock extends Array<number | string> {
  0: number | string;
  1: string;
}

type Mocks = Array<Mock>;

const mocks: Mocks = [
  // @ts-ignore
  [NaN, ''], [undefined, ''], [null, ''], ['', ''], // 1-4
  [0, '0'], [1, '1'], ['0', '0'], ['1', '1'],       // 5-8
  [123456789.1234,          '123 456 789,1234'],    // 9
  ['123456789.12000',       '123 456 789,12000'],   // 10

];


describe('addSpaceBetweenNumbers', () => {
  mocks.forEach((m, i) => it(`${i + 1}`, () => expect(addSpaceBetweenNumbers(m[0]))
    .toEqual(m[1])))
});

// npm run test:unit add-space-between-numbers.test.ts
