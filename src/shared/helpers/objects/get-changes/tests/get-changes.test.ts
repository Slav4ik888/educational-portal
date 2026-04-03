import { getChanges } from '..';
import { mocks } from './mocks';


describe('getChanges', () => {
  mocks.forEach(m => it(m[0].description, () => {
    expect(getChanges(m[0].stored, m[0].updated)).toEqual(m[1])
  }))
});

// npm run test:unit get-changes.test.ts
