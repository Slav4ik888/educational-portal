import { getMockStrLength } from '../../../../../../../../helpers/strings';
import { Mocks } from './types';

export const mocks: Mocks = [
  [
    {
      description : 'Valid text = maxLength',
      maxLength   : 101,
      str         : getMockStrLength(101)
    },
    true
  ],
  [
    {
      description : 'Text is empty string',
      maxLength   : 101,
      str         : ''
    },
    true
  ],
  [
    {
      description : 'Invalid text > maxLength',
      maxLength   : 101,
      str         : getMockStrLength(102)
    },
    false
  ],
  [
    {
      description : 'Text is undefined',
      maxLength   : 101,
      // @ts-ignore
      str         : undefined
    },
    false
  ]
]
