import { objectFieldsToString } from '..';
import { mocks } from './mocks';



describe('objectFieldsToString', () => {
  mocks.forEach(m =>
    it(m[0].description, () => {
      expect(objectFieldsToString(m[0].obj)).toEqual(m[1]);
    }));
});

// npm run test:unit object-fields-to-string.test.ts
