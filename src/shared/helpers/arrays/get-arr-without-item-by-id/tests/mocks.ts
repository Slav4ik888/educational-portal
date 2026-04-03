import { MocksOfObj, MocksObjType, MockObjType } from './types';

export const ARR: MocksObjType = [
  { id: '111', field1: 'field1', field2: 'field2' },
  { id: '222', field1: 'field3', field2: 'field4' },
  { id: '333', field1: 'field5', field2: 'field6' },
  { id: 111,   field1: 'field1', field2: 'field2' }
];


export const MOCKS: MocksOfObj<MockObjType> = [
  [
    {
      description : 'Right data, value in start',
      items       : ARR,
      value       : '111'
    },
    ARR.slice(1)
  ],
  [
    {
      description : 'Right data, value in middle',
      items       : ARR,
      value       : '222'
    },
    [ARR[0], ARR[2], ARR[3]]
  ],
  [
    {
      description : 'Right data, value in end & value is number',
      items       : ARR,
      value       : 111
    },
    ARR.slice(0, 3)
  ],
  [
    {
      description : 'items - undefined',
  // @ts-ignore
      items       : undefined,
      value       : '111'
    },
    []
  ],
  [
    {
      description : 'Items empty',
      items       : [],
      value       : '111'
    },
    []
  ],
  [
    {
      description : 'Value - undefined',
      items       : ARR,
  // @ts-ignore
      value       : undefined
    },
    ARR
  ]
];
