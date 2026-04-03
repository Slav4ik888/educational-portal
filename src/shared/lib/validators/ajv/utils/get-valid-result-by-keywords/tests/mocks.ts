import { AjvErrors } from '../../../types';
import { Mocks } from './types';

const errors: AjvErrors[] = [
  {
    dataPath : '',
    keyword  : 'required',
    message  : 'should have required property "password"',
    params: {
      missingProperty: 'password',
    },
    schemaPath: '#/required'
  },
  {
    dataPath : '',
    keyword  : 'additionalProperties',
    message  : 'should NOT have additional properties',
    params: {
      additionalProperty: 'body',
    },
    schemaPath: '#/additionalProperties'
  }
];


export const mocks: Mocks = [
  [
    {
      description: 'dataRequired',
      validate: {
        // @ts-ignore
        errors
      }
    },
    {
      valid: false,
      errors: {
        body     : 'Присутствует недопустимое поле "body".',
        password : 'Отсутствует обязательное поле "password".',
      }
    }
  ],
];
