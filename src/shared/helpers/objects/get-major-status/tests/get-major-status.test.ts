import { getValuePosition, getMajorStatus } from '..';
import { mockValuePossition, mockMajorStatus, MockObjType } from './mocks';


describe('getValuePosition', () => {
  mockValuePossition.forEach((m) => it(`getValuePosition ${m.value}`, () => {
    expect(getValuePosition(m.obj, m.value)).toEqual(m.result);
  }));
});

describe('getMajorStatus', () => {
  mockMajorStatus.forEach(m => it(`getMajorStatus cur: ${m.curStatus}, new: ${m.newStatus}`, () => {
    expect(getMajorStatus(
      m.obj,
      m.curStatus as unknown as MockObjType,
      m.newStatus as unknown as MockObjType
    ))
      .toEqual(m.result)
  }));
});

// npm run test:unit get-major-status.test.ts
