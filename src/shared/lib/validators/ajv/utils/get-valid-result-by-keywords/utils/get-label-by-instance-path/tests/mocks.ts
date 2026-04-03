import { Mocks, MockItem } from './types';
import { ErrorObject } from 'ajv';


export const mocks: Mocks = [
  [
    {
      description: 'instancePath: /bankBIK',
      err: {
        instancePath: '/bankBIK'
      } as ErrorObject
    },
    'bankBIK'
  ],
  [
    {
      description: 'instancePath: /bankBIK',
      err: {
        instancePath: '/bankBIK'
      } as ErrorObject
    },
    'bankBIK'
  ],
  [
    {
      description: 'instancePath: undefined',
      err: {
        instancePath: undefined as unknown as string
      } as ErrorObject
    },
    'general'
  ],
  [
    {
      description: 'err: undefined',
    } as MockItem,
    'general'
  ],
];
