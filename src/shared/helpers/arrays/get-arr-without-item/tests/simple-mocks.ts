import { MocksOfSimple, MocksSimpleType, MockSimpleType } from './simple-types';


export const ARR_OF_SIMPLE = ['field1', 'field2', 'field3', 'field4', 'field5', 'field6'];

export const MOCKS_OF_SIMPLE: MocksOfSimple<MockSimpleType> = [
  [
    {
      description : 'Right data',
      items       : ARR_OF_SIMPLE,
      value       : 'field1'
    },
    ARR_OF_SIMPLE.slice(1)
  ],
  [
    {
      description : 'items - undefined',
  // @ts-ignore
      items       : undefined,
      value       : 'field1',
    },
    []
  ],
  [
    {
      description : 'value is object',
      items       : ARR_OF_SIMPLE,
      value       : { id: 'field1' } as unknown as string
    },
    ARR_OF_SIMPLE
  ],
  [
    {
      description : 'value is array',
      items       : ARR_OF_SIMPLE,
      value       : [{ id: 'field1' }] as unknown as string
    },
    ARR_OF_SIMPLE
  ],
  [
    {
      description : 'Items empty',
      items       : [],
      value       : 'field1',
    },
    []
  ],
  [
    {
      description : 'Value - undefined',
      items       : ARR_OF_SIMPLE,
  // @ts-ignore
      value       : undefined,
    },
    ARR_OF_SIMPLE
  ]
];
