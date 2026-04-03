import { getValueByScheme } from '..';

const MOCK = {
  first: {
    second: {
      third: {
        fourth: {
          fifth: {
            sixs: {
              sevens: {
                eights: {
                  field: 'some field'
                }
              },
              any: {
                arr: [{
                  item0_field_1: {
                    field_1: {}
                  }
                }, {
                  item1_field_1: {
                    field_1: {},
                    field_2: {
                      a: 'aaa',
                      b: 'bbb'
                    }
                  },
                  item1_field_2: {
                    field_1: {},
                    field_2: {
                      c: 'ccc',
                      d: 'ddd'
                    }
                  }
                }]
              }
            }
          },
          any: {
            any: {}
          }
        }
      }
    },
    any: {
      any: {}
    }
  },
  any: {
    any: {}
  }
};


describe('getValueByScheme', () => {
  test('Nesting depth 7', () => {
    expect(getValueByScheme(MOCK, 'first.second.third.fourth.fifth.sixs.sevens'))
      .toEqual({
        eights: {
          field: 'some field'
        }
      });
  });

  test('Nesting depth 8', () => {
    expect(getValueByScheme(MOCK, 'first.second.third.fourth.fifth.sixs.sevens.eights'))
      .toEqual({
        field:
          'some field'
      });
  });

  test('Nesting depth 8 wuth 7 elem is undefined', () => {
    expect(getValueByScheme(MOCK, 'first.second.third.fourth.fifth.sixs.notSevens.eights'))
      .toEqual(undefined);
  });

  test('scheme is invalid', () => {
    // @ts-ignore
    expect(getValueByScheme(undefined, 'first.second.third.someField'))
      .toEqual(undefined);
  });

  test('obj is undefined', () => {
    // @ts-ignore
    expect(getValueByScheme(undefined, 'first.second.third.fourth.fifth.sixs.sevens.eights'))
      .toEqual(undefined);
  });

  test('scheme is undefined', () => {
    // @ts-ignore
    expect(getValueByScheme(MOCK, undefined))
      .toEqual(undefined);
  });

  test('scheme is invalid, without goal', () => {
    expect(getValueByScheme(MOCK, 'first.second.third.fourth.fifth.sixs.sevens.eights.nines'))
      .toEqual(undefined);
  });

  // With array
  test('scheme whith array', () => {
    expect(getValueByScheme(MOCK, 'first.second.third.fourth.fifth.sixs.any.arr.[1].item1_field_2.field_2.c'))
      .toEqual('ccc');
  });

  const data = {
    field1: {
      child1: [
        { child3: 'value1' },
        {
          child3: 'value2',
          child4: [
            { child5: 'value3' },
            { child6: 'value4' },
            {
              child7: 'value5',
              child8: 'value8'
            }
          ]
         },
      ],
      child2: 'simple value'
    }
  };

  test('scheme with arrays', () => {
    expect(getValueByScheme(data, 'field1.child1.[0].child3')).toEqual('value1');
    expect(getValueByScheme(data, 'field1.child1.[1].child3')).toEqual('value2');
    expect(getValueByScheme(data, 'field1.child1[1].child3')).toEqual('value2');
    expect(getValueByScheme(data, 'field1.child2')).toEqual('simple value');
    expect(getValueByScheme(data, 'field1.nonexistent.[0]')).toEqual(undefined);
  });
  test('scheme with 2 arrays in scheme', () => {
    expect(getValueByScheme(data, 'field1.child1.[1].child4.[2].child8')).toEqual('value8');
  });
});

// npm run test:unit get-value-by-scheme.test.ts
