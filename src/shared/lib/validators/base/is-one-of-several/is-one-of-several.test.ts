import { isOneOfSeveral } from '.';

interface MockItemCase extends Array<any | Array<any>>  {
  0: string | object
  1: Array<any>
}

interface MockItem {
  case   : MockItemCase
  result : boolean
}

const MOCKS: MockItem[] = [
  {
    case: ['Word', ['Number', 'Word', 'Strings']],
    result: true
  }, {
    case: ['Word', ['Number', 'World', 'Strings']],
    result: false
  }, { // Object !== Object
    case: [{ word: 'String' }, [{ word: 'String' }, 'Word', 'Strings']],
    result: false
  }, {
    case: [{ word: 'String' }, ['String', 'Word', 'Strings']],
    result: false
  },
];


describe('isOneOfSeveral', () => {
  MOCKS.forEach(m => {
    it('Case', () => {
      expect(isOneOfSeveral(m.case[1], m.case[0])).toEqual(m.result)
    })
  })
});

// npm run test:unit is-one-of-several.test.ts
