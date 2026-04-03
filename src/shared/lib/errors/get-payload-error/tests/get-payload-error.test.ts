import { Errors } from '../../../validators';
import { getPayloadError } from '..';

const BIG_OBJ = {
  error : 'text',
  some  : 'text',
  addy  : 123
} as unknown as Errors;

describe('getPayloadError', () => {
  test('Payload is undefined', () => expect(getPayloadError(undefined)).toEqual({}));
  test('Payload is empty', () => expect(getPayloadError({})).toEqual({}));
  test('Payload is valid', () => expect(getPayloadError({ error: 'text' })).toEqual({ error: 'text' }));
  test('Payload is valid', () => expect(getPayloadError(BIG_OBJ)).toEqual(BIG_OBJ));
});

// npm run test:unit get-payload-error.test.ts
