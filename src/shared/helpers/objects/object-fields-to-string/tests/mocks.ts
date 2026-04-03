import { Mocks } from './types'


export const mocks: Mocks = [
  [
    {
      description: 'Valid obj',
      obj: {
        error: '',
        mask: 'Какой-то текcт',
        obj: {
          a: 1,
          b: 'str',
          c: [{ a: 123 }],
          d: undefined,
          e: NaN,
          f: null,
          g: 'myndy'
        },
        last: 123
      }
    },
    // eslint-disable-next-line
    'error: , mask: Какой-то текcт, obj: { a: 1, b: str, c: [{"a":123}], d: undefined, e: NaN, f: null, g: myndy }, last: 123'
  ],
  [
    {
      description: 'Obj is undefined',
  // @ts-ignore
      obj: undefined
    },
    ''
  ],
  [
    {
      description: 'Obj is string',
      obj: 'Obj is string'
    },
    'Obj is string'
  ],
  [
    {
      description: 'Obj is array',
      obj: [{ a: 1 }]
    },
    '[{"a":1}]'
  ],
]
