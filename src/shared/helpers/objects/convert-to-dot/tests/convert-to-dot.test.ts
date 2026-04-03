import { convertToDot } from '..';


describe('convertToDot', () => {
  test('obj is empty', () => {
    expect(convertToDot({})).toEqual({});
  });

  test('obj is undefined', () => {
  // @ts-ignore
    expect(convertToDot(undefined)).toEqual({});
  });


  test('obj with many fields', () => {
    expect(convertToDot({
      first: {
        second: {
          third: {
            fourth: {
              str: 'string',
              number: 123,
              arr: [1, 2, 3]
            },
            strInThird: 'string',
            numberInThird: 456,
            arrInThird: [4, 5, 6]
          }
        }
      },
      any: {
        some: 'field',
        any: 'some'
      }
    })).toEqual({
      'first.second.third.fourth.str': 'string',
      'first.second.third.fourth.number': 123,
      'first.second.third.fourth.arr': [1, 2, 3],
      'first.second.third.strInThird': 'string',
      'first.second.third.numberInThird': 456,
      'first.second.third.arrInThird': [4, 5, 6],
      'any.some': 'field',
      'any.any': 'some'
    });
  });
});


// npm run test:unit convert-to-dot.test.ts
