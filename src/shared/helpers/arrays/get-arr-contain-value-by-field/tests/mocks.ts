import { Mocks } from './types';


const arr = [
  { id: '1', field: 'labelString' },
  { id: '2', field: 'laBel' },
  { id: '3', field: 'any' },
  { id: '4', field: 'label' },
  { id: '5', field: 'any' },
  { id: '6', field: 'abel' },
  { id: '7', field: 'LABELMAGAZIN' },
  { id: '8', field: '' },
  { id: '9', field: undefined },
  { id: '9', some: 'some field' },
];

const resultArr = [
  { id: '1', field: 'labelString' },
  { id: '2', field: 'laBel' },
  { id: '4', field: 'label' },
  { id: '7', field: 'LABELMAGAZIN' },
];

const regexp = /label/i;

export const mocks: Mocks = [
  [
    {
      description: 'All right data',
      // @ts-ignore
      arr,
      regexp,
      field: 'field'
    },
    resultArr
  ]
];
