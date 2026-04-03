import { Mocks } from './types';


export const mocks: Mocks = [
  [
    {
      description : 'Right field without wrap',
      field       : 'Company Name',
    },
    'Company Name'
  ],
  [
    {
      description : 'Field is undefined',
      field: undefined as unknown as string
    },
    ''
  ],
  [
    {
      description : 'Field is empty',
      field: ''
    },
    ''
  ],
  [
    {
      description : 'With wrapStart',
      field       : 'Company Name',
      wrapper     : '"111 - ###'
    },
    '"111 - Company Name'
  ],
  [
    {
      description : 'With wrapEnd',
      field       : 'Company Name',
      wrapper     : '### - !!!'
    },
    'Company Name - !!!'
  ],
  [
    {
      description : 'With wraps',
      field       : 'Company Name',
      wrapper   : '"111 - ### - !!!"'
    },
    '"111 - Company Name - !!!"'
  ],
  [
    {
      description : 'With wraps but field is undefined',
      field       : undefined as unknown as string,
      wrapper   : '"111 - ### - !!!"'
    },
    ''
  ],
  [
    {
      description : 'Invalid wrapper',
      field       : 'Company Name',
      wrapper   : '"111 - ## - !!!"'
    },
    'Company Name'
  ],
];
