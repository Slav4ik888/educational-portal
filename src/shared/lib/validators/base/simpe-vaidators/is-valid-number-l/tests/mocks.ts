import { Mocks } from './types';

export const mocks: Mocks = [
  [
    {
      description : 'Valid text',
      length : 10,
      strNum : '1234567890'
    },
    true
  ],
  [
    {
      description : 'Text is empty string',
      length : 10,
      strNum : ''
    },
    false
  ],
  [
    {
      description : 'Text not a digit',
      length : 3,
      strNum : 123 as unknown as string
    },
    false
  ],
  [
    {
      description : 'Text is undefined',
      length : 2,
      // @ts-ignore
      strNum : undefined
    },
    false
  ]
]
