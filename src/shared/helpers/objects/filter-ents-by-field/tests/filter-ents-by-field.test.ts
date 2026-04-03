import { filterEntsByField } from '..';
import { Entities, Item, Mocks } from './types';


const entities: Entities<Item> = {
  id_1: {
    id    : 'id_1',
    name  : 'string',
    value : true,
    data  : {
      foo: 'foo_1',
      bae: 1
    },
    arr: ['foo', 'bae', 'string888']
  },
  id_2: {
    id    : 'id_2',
    name  : 'string888',
    value : true,
    data  : {
      foo: 'foo_2',
      bae: 2
    }
  },
  id_3: {
    id    : 'id_3',
    name  : 'string',
    value : true,
    data  : {
      foo: 'foo_3',
      bae: 3
    },
    arr: ['string888']
  },
  id_4: {
    id    : 'id_4',
    name  : 'string888',
    value : true,
    data  : {
      foo: 'foo_4',
      bae: 4
    },
    arr: ['foo', 'bae', '']
  },
  id_5: {
    id    : 'id_5',
    name  : 'chebyrek',
    value : false,
    data  : {
      foo: 'foo_3',
      bae: 3
    },
    arr: ['str888']
  },
};


const mocks: Mocks<Item> = [
  [
    {
      description: 'All right',
      entities,
      field: 'name',
      value: 'string888'
    },
    {
      id_2: { ...entities.id_2 },
      id_4: { ...entities.id_4 },
    },
  ],
  [
    {
      description: 'No values in result',
      entities,
      field: 'name',
      value: 'string666'
    },
    {},
  ],
  [
    {
      description: 'field is undefined',
      entities,
  // @ts-ignore
      field: undefined,
      value: 'string666'
    },
    {}
  ],
  [
    {
      description: 'value is undefined',
      entities,
      field: 'name',
  // @ts-ignore
      value: undefined
    },
    {}
  ],

  // INCLUDES
  [
    {
      description : 'Includes - right',
      entities,
      field       : 'arr',
      value       : 'string888',
      includes    : true
    },
    {
      id_1: { ...entities.id_1 },
      id_3: { ...entities.id_3 },
    },
  ],

  // VALUE IS ARRAY
  [
    {
      description : 'Value is array - right',
      entities,
      field       : 'name',
      value       : ['may', 'string888', 'foo', 'bae'],
    },
    {
      id_2: { ...entities.id_2 },
      id_4: { ...entities.id_4 },
    },
  ],

  // WITH VALIDATOR FUNCTION
  [
    {
      description : 'With  validFunc - right',
      entities,
      field       : 'name',
      value       : '',
      validFunc   : (type: string) => type === 'chebyrek' || type === 'string888'
    },
    {
      id_2: { ...entities.id_2 },
      id_4: { ...entities.id_4 },
      id_5: { ...entities.id_5 },
    },
  ],
];


describe('filterEntsByField', () => {
  mocks.forEach(m => it(m[0].description, () => {
    expect(filterEntsByField(m[0].entities, m[0].field, m[0].value, m[0].includes, m[0].validFunc))
      .toEqual(m[1])
  }))
});

// npm run test filter-ents-by-field.test.ts
