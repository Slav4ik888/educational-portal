import { cloneObj } from '../../objects';
import { Mocks } from './types';

const prevObj = {
  id          : 'id123',
  firstStr    : 'firstStr text',
  firstArrStr : ['first 123', 'first 234'],
  firstArrObj : [{ a: 'first 123', b: 'first 234' }, { c: 'first 567', d: 'first 890' }],
  firstObj    : { field: 'field' },

  firstObjBig: {
    secondStr    : 'secondStr text',
    secondArrStr : ['second 123', 'second 234'],
    secondArrObj : [{ a: 'second 123', b: 'second 234' }, { c: 'second 567', d: 'second 890' }],
    secondObj    : { field: 'field' },

    secondObjBig: {
      thirdStr    : 'thirdStr text',
      thirdArrStr : ['third 123', 'third 234'],
      thirdArrObj : [{ a: 'third 123', b: 'third 234' }, { c: 'third 567', d: 'third 890' }],
      thirdObj    : { field: 'field' },
      thirdBool   : false,

      thirdObjBig: {
        fourthStr    : 'fourthStr text',
        fourthArrStr : ['fourth 123', 'fourth 234'],
        fourthArrObj : [{ a: 'fourth 123', b: 'fourth 234' }, { c: 'fourth 567', d: 'fourth 890' }],
        fourthObj    : { field: 'field' },

        fourthObjBig: {
          fifthStr    : 'fifthStr text',
          fifthArrStr : ['fifth 123', 'fifth 234'],
          fifthArrObj : [{ a: 'fifth 123', b: 'fifth 234' }, { c: 'fifth 567', d: 'fifth 890' }],
          fifthObj    : { field: 'field' },
          fifthBool   : true
        }
      }
    }
  }
};



const updatedFields = {
  id               : 'id123 changed',                    // Changed
  firstStr         : 'firstStr text changed',            // Changed
  firstArrStr      : ['first 123', 'first 234 changed'], // Changed
  firstNewField    : 'firstNewField text',               // New field
  firstNewEmptyObj : {},                                 // New field

  firstObjBig: {
    secondArrObj: [
      { a: 'second 123', b: 'second 234' },
      { c: 'second 567', d: 'second 890  changed' }      // Changed
    ],

    secondObjBig: {
      thirdObj    : {},                                  // Set empty => not changes this filed, because delete fields are not supported
      thirdBool   : true,

      thirdObjBig : {
        fourthStr: 'fourthStr text changed',             // Changed
        fourthObj: {
          field    : {},                                 // String field changed to empty object
          newfield : '444'                               // New field
        },

        fourthObjBig: {
          fifthNewField : 'fifthNewField text',          // New field
          fifthArrObj: [
            { a: 'fifth 123', b: 'fifth 234' },
            { c: 'fifth 567', d: 'fifth 890  changed' }  // Changed
          ],
          fifthObj      : { field: 'field changed' },     // Changed
          fifthBool     : false                          // Changed
        }
      }
    }
  }
};



const updatedObj = {
  id               : 'id123 changed',                    // Changed
  firstStr         : 'firstStr text changed',            // Changed
  firstArrStr      : ['first 123', 'first 234 changed'], // Changed
  firstArrObj      : [{ a: 'first 123', b: 'first 234' }, { c: 'first 567', d: 'first 890' }],
  firstObj         : { field: 'field' },
  firstNewField    : 'firstNewField text',               // New field
  firstNewEmptyObj : {},                                 // New field

  firstObjBig: {
    secondStr    : 'secondStr text',
    secondArrStr : ['second 123', 'second 234'],
    secondArrObj: [
      { a: 'second 123', b: 'second 234' },
      { c: 'second 567', d: 'second 890  changed' }      // Changed
    ],
    secondObj    : { field: 'field' },

    secondObjBig: {
      thirdStr    : 'thirdStr text',
      thirdArrStr : ['third 123', 'third 234'],
      thirdArrObj : [{ a: 'third 123', b: 'third 234' }, { c: 'third 567', d: 'third 890' }],
      thirdObj    : { field: 'field' },
      thirdBool   : true,

      thirdObjBig: {
        fourthStr    : 'fourthStr text changed',         // Changed
        fourthArrStr : ['fourth 123', 'fourth 234'],
        fourthArrObj : [{ a: 'fourth 123', b: 'fourth 234' }, { c: 'fourth 567', d: 'fourth 890' }],
        fourthObj: {
          field    : {},                                 // Changed
          newfield : '444'                               // New field
        },

        fourthObjBig: {
          fifthStr      : 'fifthStr text',
          fifthArrStr   : ['fifth 123', 'fifth 234'],
          fifthArrObj: [
            { a: 'fifth 123', b: 'fifth 234' },
            { c: 'fifth 567', d: 'fifth 890  changed' }  // Changed
          ],
          fifthObj      : { field: 'field changed' },     // Changed
          fifthNewField : 'fifthNewField text',          // New field
          fifthBool     : false                          // Changed
        }
      }
    }
  }
};



const fakeUserStart = {
  id            : '123',
  companyId     : '345',
  person        : {
    displayName   : '',
    avatarUrl     : 'avatarUrl',
    phoneNumber   : '',
    phones        : [],
    fio           : {
      firstName  : 'Slava',
      secondName : '',
      middleName : ''
    },
  },
  email         : '',
};


const fakeUserUpdatedFields = {
  companyId: '777',
  person: {
    fio: {
      secondName: 'Korzan',
    },
  },
};


const fakeUserUpdated = {
  id            : '123',
  companyId     : '777',
  person        : {
    displayName   : '',
    avatarUrl     : 'avatarUrl',
    phoneNumber   : '',
    phones        : [],
    fio           : {
      firstName  : 'Slava',
      secondName : 'Korzan',
      middleName : ''
    },
  },
  email         : '',
};


export const mocks: Mocks = [
  [{
    description : 'updatedFields is undefined',
    prevObj,
  // @ts-ignore
    updatedFields: undefined
  },
    prevObj],
  [{
    description : 'prevObj is undefined',
  // @ts-ignore
    prevObj: undefined,
    updatedFields
  },
    updatedFields],
  [{
    description : 'prevObj = updatedFields',
    prevObj,
    updatedFields: cloneObj(prevObj)
  },
    prevObj],

  [{
    description : 'updatedFields = {}',
    prevObj,
    updatedFields: {}
  },
    prevObj],

  [{
    description : 'With changes',
    prevObj,
    updatedFields
  },
    updatedObj],

  [{
    description   : 'User changes',
    prevObj       : fakeUserStart,
    updatedFields : fakeUserUpdatedFields,
  },
    fakeUserUpdated],
];
