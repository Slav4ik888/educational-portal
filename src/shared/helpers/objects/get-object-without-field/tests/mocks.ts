import { Mocks } from './types';

export const mocks: Mocks = [
  [
    {
      obj: {
        id: 0,
        error: '',
        mask: 'Какой-то текcт',
        obj: {},
        exec: {
          field: 'field...',
          anyField: 'anyField...'
        }
      },
      field1: 'id',
    },
    {
      error: '',
      mask: 'Какой-то текcт',
      obj: {},
      exec: {
        field: 'field...',
        anyField: 'anyField...'
      }
    }
  ],

  [
    {
      obj: {
        id: 0,
        error: '',
        mask: 'Какой-то текcт',
        obj: {},
        exec: {
          field: 'field...',
          anyField: 'anyField...'
        }
      },
      field1: 'exec',
      field2: 'field',
    },
    {
      id: 0,
      error: '',
      mask: 'Какой-то текcт',
      obj: {},
      exec: {
        anyField: 'anyField...'
      }
    }
  ],

  [
    {
      obj: {
        some: 'any'
      },
  // @ts-ignore
      field1: undefined,
      field2: 'id',
    },
    {
      some: 'any'
    }
  ],

  [
    {
      obj: {
        some: 'any'
      },
      field1: 'id',
      field2: 123 as unknown as string,
    },
    {
      some: 'any'
    }
  ],

  [
    {
      obj: {},
      field1: 'id',
    },
    {}
  ]
];
