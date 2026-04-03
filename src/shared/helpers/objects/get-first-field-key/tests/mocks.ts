import { Mocks } from './types';



export const mocks: Mocks = [
  [
    {
      description : 'Верные данные',
      obj         : { id: 'userId123' }
    },
    'id'
  ],
  [
    {
      description : 'Obj is undefined',
  // @ts-ignore
      obj         : undefined
    },
    ''
  ],
  [
    {
      description : 'Obj is empty',
      obj         : {}
    },
    ''
  ],
  [
    {
      description : 'Obj with greater than 1 filed',
      obj         : { id: 'userId123', some: 'foobee' }
    },
    ''
  ],
];
