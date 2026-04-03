import { Mocks } from './types';
import { withStaticLastChange } from '..';


const mocks: Mocks = [
  [{
    obj: {
      user: {
        family: false,
        userId: 'userId_1',
        executive: {
          first: '123',
          second: '234',
          third: {
            last: 'last data',
            open: false
          }
        }
      },
      lastChange: '2022-01-17T02:34:37.224Z'
    },
    lastChange: '2022-01-16'
  }, {
      user: {
        family: false,
        userId: 'userId_1',
        executive: {
          first: '123',
          second: '234',
          third: {
            last: 'last data',
            open: false
          }
        }
      },
      lastChange: '2022-01-16'
    }],


  [{ obj: undefined as unknown as object, lastChange: '2022-01-16' }, {}],
  [{ obj: { user: 'Foo-Beee' }, lastChange: '' },        {}],
  [{ obj: { user: 'Foo-Beee' }, lastChange: undefined  as unknown as string }, {}],
];



describe('mergeWithScheme', () => {
  mocks.forEach((m, i) => {
    it(`${i + 1}`, () => {
      expect(withStaticLastChange(m[0].obj, m[0].lastChange))
        .toEqual(m[1])
    })
  })
});

// npm run test:unit with-static-last-change.test.ts
