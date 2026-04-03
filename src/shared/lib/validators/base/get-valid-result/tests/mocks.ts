import { Errors } from '../../../../validators';
import { Mocks } from './types';

export const mocks: Mocks = [
  [
    {
      description: 'data is { email: "Invalid email" }',
      data: { email: 'Invalid email' }
    },
    {
      errors: { email: 'Invalid email' },
      valid: false
    }
  ],
  [
    {
      description: 'data is empty',
      data: undefined as unknown as Errors
    },
    {
      errors: {},
      valid: true
    }
  ]
]
