import { Mocks } from './types';

const arr = [
  { itemId: 1, ids: ['yellow', 'red', 'booms'] },
  { itemId: 2, ids: ['green', 'yellow', 'red'] },
  { itemId: 3, ids: ['red', 'green', 'yellow'] }
];


export const mocks: Mocks<any> = [
  [
    {
      description : 'Right data',
      arr,
      fieldArr    : 'ids',
      value       : 'green'
    },
    [arr[1], arr[2]]
  ],
  [
    {
      description : 'Arr is undefined',
      // @ts-ignore
      arr         : undefined,
      fieldArr    : 'ids',
      value       : 'green'
    },
    []
  ]
];
