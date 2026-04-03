import { SCHEMA_NAME } from '.';


export const definitions = {
  $id  : SCHEMA_NAME.DEFS_BASE,
  type : 'object',

  definitions: {
    date: {
      type    : 'number',
      minimum : 0,
      maximum : 4102423200000
    },
    email: {
      type      : 'string',
      maxLength : 50,
      format    : 'email'
    },
    password: {
      type      : 'string',
      minLength : 6,
      maxLength : 50
    },
    confirmPassword : {
      const: {
        $data: '1/password'
      }
    },
    order: {
      type    : 'number',
      minimum : 0,
      maximum : 1000000
    }
  }
};
