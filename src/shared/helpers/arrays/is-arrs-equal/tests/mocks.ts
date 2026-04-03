import { Mocks } from './types';

// Arrs with simple object
const arr1Simple = [
  { id: '10', city: 'Irkutst',     country: 'Russia' },
  { id: '11', city: 'Chita',       country: 'Russia' },
  { id: '12', city: 'Chelyabinsk', country: 'Russia' },
  { id: '13', city: 'Stavropol',   country: 'Russia' }
];

const arr2SimpleEqualArr1 = [
  { id: '10', city: 'Irkutst',     country: 'Russia' },
  { id: '11', city: 'Chita',       country: 'Russia' },
  { id: '12', city: 'Chelyabinsk', country: 'Russia' },
  { id: '13', city: 'Stavropol',   country: 'Russia' }
];

const arr2Simple = [
  { id: '10', city: 'Bishkek',     country: 'Russia' },
  { id: '11', city: 'Chita',       country: 'Russia' },
  { id: '12', city: 'Chelyabinsk', country: 'Russia' },
  { id: '13', city: 'Stavropol',   country: 'Russia' }
];

// Arrs with simple object & contains arr

const arr1SimpleWithArr = [
  { id: '10', city: 'Irkutst',     country: 'Russia', arr: [1, 2, 3] },
  { id: '11', city: 'Chita',       country: 'Russia', arr: [1, 2, 3] },
  { id: '12', city: 'Chelyabinsk', country: 'Russia', arr: [1, 2, 3] },
  { id: '13', city: 'Stavropol',   country: 'Russia', arr: [1, 2, 3] }
];

const arr2SimpleWithArrEqualArr1 = [
  { id: '10', city: 'Irkutst',     country: 'Russia', arr: [1, 2, 3] },
  { id: '11', city: 'Chita',       country: 'Russia', arr: [1, 2, 3] },
  { id: '12', city: 'Chelyabinsk', country: 'Russia', arr: [1, 2, 3] },
  { id: '13', city: 'Stavropol',   country: 'Russia', arr: [1, 2, 3] }
];

const arr2SimpleWithArr = [
  { id: '10', city: 'Irkutst',     country: 'Russia', arr: [3, 2, 1] }, // Not equal
  { id: '11', city: 'Chita',       country: 'Russia', arr: [1, 2, 3] },
  { id: '12', city: 'Chelyabinsk', country: 'Russia', arr: [1, 2, 3] },
  { id: '13', city: 'Stavropol',   country: 'Russia', arr: [1, 2, 3] }
];


// Arrs with complex object
const arr1Complex = [
  { id: '10', city: { town: 'Irkutst', street: 'New street' },     country: 'Russia' },
  { id: '11', city: { town: 'Chita', street: 'New street' },       country: 'Russia' },
  { id: '12', city: { town: 'Chelyabinsk', street: 'New street' }, country: 'Russia' },
  { id: '13', city: { town: 'Stavropol', street: 'New street' },   country: 'Russia' }
];

const arr2ComplexEqualArr1 = [
  { id: '10', city: { town: 'Irkutst',     street: 'New street' }, country: 'Russia' },
  { id: '11', city: { town: 'Chita',       street: 'New street' }, country: 'Russia' },
  { id: '12', city: { town: 'Chelyabinsk', street: 'New street' }, country: 'Russia' },
  { id: '13', city: { town: 'Stavropol',   street: 'New street' }, country: 'Russia' }
];

const arr2Complex = [
  { id: '10', city: { town: 'Bishkek',     street: 'New street' }, country: 'Russia' },
  { id: '11', city: { town: 'Chita',       street: 'New street' }, country: 'Russia' },
  { id: '12', city: { town: 'Chelyabinsk', street: 'New street' }, country: 'Russia' },
  { id: '13', city: { town: 'Stavropol',   street: 'New street' }, country: 'Russia' }
];

export const mocks: Mocks = [
  [
    {
      description: 'arr1 is undefined',
  // @ts-ignore
      arr1: undefined,
      arr2: [1]
    },
    false
  ],
  [
    {
      description: 'arr2 is undefined',
      arr1: [1],
  // @ts-ignore
      arr2: undefined
    },
    false
  ],
  [
    {
      description: 'arr1.length > arr2.length',
      arr1: [1],
      arr2: []
    },
    false
  ],
  [
    {
      description: 'simple arr1 === arr2',
      arr1: [1, '2', 3],
      arr2: [1, '2', 3]
    },
    true
  ],
  [
    {
      description: 'simple arr1 !== arr2',
      arr1: [1, '2', 3],
      arr2: [1, '2', 4]
    },
    false
  ],
  [
    {
      description: 'нарушен порядок',
      arr1: [1, '2', 3],
      arr2: [1, 3, '2']
    },
    false
  ],
  // Simple
  [
    {
      description: 'arrs with simle obj - equale',
      arr1: arr1Simple,
      arr2: arr2SimpleEqualArr1
    },
    true
  ],
  [
    {
      description: 'arrs with simle obj - not equale',
      arr1: arr1Simple,
      arr2: arr2Simple
    },
    false
  ],

  // Simple with arr
  [
    {
      description: 'arrs with simle obj with arr - equale',
      arr1: arr1SimpleWithArr,
      arr2: arr2SimpleWithArrEqualArr1
    },
    true
  ],
  [
    {
      description: 'arrs with simle obj with arr - not equale',
      arr1: arr1SimpleWithArr,
      arr2: arr2SimpleWithArr
    },
    false
  ],

  // Complex obj
  [
    {
      description: 'arrs with complex obj - equale',
      arr1: arr1Complex,
      arr2: arr2ComplexEqualArr1
    },
    true
  ],
  [
    {
      description: 'arrs with complex obj - not equale',
      arr1: arr1Complex,
      arr2: arr2Complex
    },
    false
  ],
]
