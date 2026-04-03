import { MocksOfObj, MocksObjType, MockObjType } from './obj-types';

export const ARR_OF_OBJ: MocksObjType = [
  { id: '111', field1: 'field1', field2: 'field2' },
  { id: '222', field1: 'field3', field2: 'field4' },
  { id: '333', field1: 'field5', field2: 'field6' }
];


export const MOCKS_OF_OBJ: MocksOfObj<MockObjType> = [
  [
    {
      description : 'Right data',
      items       : ARR_OF_OBJ,
      value       : { id: '111' },
      field       : 'id'
    },
    ARR_OF_OBJ.slice(1)
  ],
  [
    {
      description : 'Right data, value not object',
      items       : ARR_OF_OBJ,
      value       : '111',
      field       : 'id'
    },
    ARR_OF_OBJ.slice(1)
  ],
  [
    {
      description : 'Items - undefined',
  // @ts-ignore
      items       : undefined,
      value       : { id: '111' },
      field       : 'id'
    },
    []
  ],
  [
    {
      description : 'Items empty',
      items       : [],
      value       : { id: '111' },
      field       : 'id'
    },
    []
  ],
  [
    {
      description : 'Value - undefined',
      items       : ARR_OF_OBJ,
  // @ts-ignore
      value       : undefined,
      field       : 'id'
    },
    ARR_OF_OBJ
  ],
  [
    {
      description : 'Field - undefined, value with 1 field',
      items       : ARR_OF_OBJ,
      value       : { id: '333' },
      field       : undefined
    },
    ARR_OF_OBJ.slice(0, 2)
  ],
  [
    {
      description : 'Field - undefined, value with greater than 1 field',
      items       : ARR_OF_OBJ,
      value       : { id: '333', field1: 'some data' },
      field       : undefined
    },
    ARR_OF_OBJ
  ],
];
