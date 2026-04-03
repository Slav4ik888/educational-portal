import { Mocks } from './types';


const stored = {
  id: '123',
  person: {
    first  : 'Slava',
    second : 'Korzan',
    middle : 'Alexandrovich',
    emptyNumber: 0,
    emptyString: ''
  },
  courseExecution: {
    course : [{ id: 1 }],
    secondLvl : {
      thirdLvl: {
        some: 12
      },
      someInSecond: 'someInSecond'
    }
  },
  email : 'course@thm.su',
  any   : 'any - field - nah',
  baee  : 'foo-baee'
};


const updated = {
  id: '123',
  person: {
    first  : 'Slava',
    second : 'K',
    middle : 'Alexandrovich'
  },
  courseExecution: {
    course : [{ id: 1 }, { id: 2 }],
    secondLvl : {
      thirdLvl: {
        newFieldInThirdLvl: '123'
      }
    },
    newFieldInSecondLvl: {
      some: 123
    }
  },
  email : 'course@thm.su',
  any   : 'any - field - nah',
  baee  : 'baee',
  newFieldInFirstLvl : {}
};


export const mocks: Mocks = [
  [
    {
      description: 'Get changed fields',
      stored,
      updated
    },
    {
      person: {
        second: 'K'
      },
      courseExecution: {
        course: [{ id: 1 }, { id: 2 }],
        secondLvl : {
          thirdLvl: {
            newFieldInThirdLvl: '123'
          }
        },
        newFieldInSecondLvl: {
          some: 123
        }
      },
      baee     : 'baee',
      newFieldInFirstLvl : {}
    }
  ],
  [
    {
      description : 'Stored is undefined',
  // @ts-ignore
      stored      : undefined,
      updated
    },
    updated
  ],
  [
    {
      description : 'Updated is undefined',
      stored,
  // @ts-ignore
      updated     : undefined
    },
    {}
  ],
  [
    {
      description : 'Updated with empty value',
      stored,
      updated: {
        person: {
          emptyNumber: 0,
          emptyString: ''
        }
      }
    },
    {}
  ]
];
