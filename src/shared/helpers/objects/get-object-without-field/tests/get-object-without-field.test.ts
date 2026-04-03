import { getObjectWithoutField } from '..';
import { mocks } from './mocks';


describe('OBJECTS - getObjectWithoutField', () => {
  mocks.forEach((m, i) => it(`getObjectWithoutField - ${i}`, () => {
    expect(getObjectWithoutField(m[0].obj, m[0].field1, m[0]?.field2)).toEqual(m[1]);
  }));
});

// npm run test get-object-without-field.test.ts
