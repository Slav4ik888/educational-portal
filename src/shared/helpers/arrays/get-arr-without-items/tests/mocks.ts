import { Mocks, MocksObjType, MockObjType } from './types';

export const arr: MocksObjType = [
  { id: '111', field1: 'field1',  field2: 'field2' },
  { id: '222', field1: 'field3',  field2: 'field4' },
  { id: '333', field1: 'field4',  field2: 'field4' },
  { id: '444', field1: 'field5',  field2: 'field6' },
  { id: '555', field1: 'field7',  field2: 'field8' },
  // @ts-ignore
  { id: '666', field1: undefined, field2: 'field9' },
  { id: 111,   field1: 'field1',  field2: 'field2' }
];


export const MOCKS: Mocks<MockObjType> = [
  [
    {
      description : 'Right data',
      arr,
      field       : 'field1',
      values      : ['field1', 'field3', 'field4']
    },
    [
      { id: '444', field1: 'field5',  field2: 'field6' },
      { id: '555', field1: 'field7',  field2: 'field8' },
  // @ts-ignore
      { id: '666', field1: undefined, field2: 'field9' }
    ]
  ],
  [
    {
      description : 'Arr is undefined',
  // @ts-ignore
      arr         : undefined,
      field       : 'field1',
      values      : ['field1', 'field3', 'field4']
    },
    undefined
  ],
  [
    {
      description : 'Arr is []',
      arr         : [],
      field       : 'field1',
      values      : ['field1', 'field3', 'field4']
    },
    []
  ],
  [
    {
      description : 'Arr without field',
      arr         : [{ id: '2' }] as MocksObjType,
      field       : 'field1',
      values      : ['field1', 'field3', 'field4']
    },
    [{ id: '2' }] as MocksObjType
  ],
  [
    {
      description : 'field is undefined',
      arr,
  // @ts-ignore
      field       : undefined,
      values      : ['field1', 'field3', 'field4']
    },
    arr
  ],
  [
    {
      description : 'values is undefined',
      arr,
      field       : 'field1',
  // @ts-ignore
      values      : undefined
    },
    arr
  ],
  [
    {
      description : 'values is [undefined]',
      arr,
      field       : 'field1',
  // @ts-ignore
      values      : [undefined, 'field5', 'field1']
    },
    [
      { id: '222', field1: 'field3',  field2: 'field4' },
      { id: '333', field1: 'field4',  field2: 'field4' },
      { id: '555', field1: 'field7',  field2: 'field8' },
    ]
  ],
];
