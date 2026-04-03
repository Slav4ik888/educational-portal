import { ErrorText } from '../../../errors-texts';
import { getValidResult } from '../../../base';
import { Validation } from '../../../../validators';


interface MockItem {
  description : string
  data        : { email: string }
  required?   : boolean
}


interface Mock extends Array<MockItem | Validation> {
  0: MockItem
  1: Validation
}

export type Mocks = Mock[]


export const mocks: Mocks = [
  // REQUIRED
  [
    {
      description: 'Valid email, required',
      data: { email: 'korzan.va@mail.ru' },
      required: true
    },
    getValidResult()
  ],
  [
    {
      description: 'Email is empty, required',
      data: { email: '' },
      required: true
    },
    getValidResult({ email: ErrorText.EMAIL_INVALID })
  ],
  [
    {
      description: 'Data is undefined, required',
      // @ts-ignore
      data: undefined,
      required: true
    },
    getValidResult({ email: ErrorText.REQUIRED })
  ],
  [
    {
      description: 'Email is undefined, required',
      // @ts-ignore
      data: { email: undefined },
      required: true
    },
    getValidResult({ email: ErrorText.NOT_BE_UNDEFINED })
  ],
  [
    {
      description: 'Email is null, required',
      // @ts-ignore
      data: { email: null },
      required: true
    },
    getValidResult({ email: ErrorText.INVALID_DATA })
  ],
  [
    {
      description: 'Email is number, required',
      data: { email: 123 as unknown as string },
      required: true
    },
    getValidResult({ email: ErrorText.INVALID_DATA })
  ],
  [
    {
      description: 'Invalid email - "korzan.va@mail", required',
      data: { email: 'korzan.va@mail' },
      required: true
    },
    getValidResult({ email: ErrorText.EMAIL_INVALID })
  ],
  [
    {
      description: 'Invalid email - "korzan.va@", required',
      data: { email: 'korzan.va@' },
      required: true
    },
    getValidResult({ email: ErrorText.EMAIL_INVALID })
  ],
  [
    {
      description: 'Email > max length, required',
      data: { email: 'korzan1234korzan1234korzan1234korzan12345.va@mail.ru' },
      required: true
    },
    getValidResult({ email: ErrorText.STR_MORE_THAN })
  ],

  // NOT REQUIRED

  [
    {
      description: 'Valid email, not required',
      data: { email: 'korzan.va@mail.ru' }
    },
    getValidResult()
  ],
  [
    {
      description: 'Data is undefined, not required',
      // @ts-ignore
      data: undefined
    },
    getValidResult()
  ],
  [
    {
      description: 'Email is empty, not required',
      data: { email: '' }
    },
    getValidResult()
  ],
  [
    {
      description: 'Email is undefined, not required',
      // @ts-ignore
      data: { email: undefined }
    },
    getValidResult({ email: ErrorText.NOT_BE_UNDEFINED })
  ],
  [
    {
      description: 'Email is null, not required',
      // @ts-ignore
      data: { email: null }
    },
    getValidResult({ email: ErrorText.INVALID_DATA })
  ],
  [
    {
      description: 'Email is number, not required',
      data: { email: 123 as unknown as string }
    },
    getValidResult({ email: ErrorText.INVALID_DATA })
  ],
  [
    {
      description: 'Invalid email - "korzan.va@mail", not required',
      data: { email: 'korzan.va@mail' }
    },
    getValidResult({ email: ErrorText.EMAIL_INVALID })
  ],
  [
    {
      description: 'Invalid email - "korzan.va@", not required',
      data: { email: 'korzan.va@' }
    },
    getValidResult({ email: ErrorText.EMAIL_INVALID })
  ],
  [
    {
      description: 'Email > max length, not required',
      data: { email: 'korzan1234korzan1234korzan1234korzan12345.va@mail.ru' }
    },
    getValidResult({ email: ErrorText.STR_MORE_THAN })
  ]
]
