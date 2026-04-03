const MockObj = {
  first  : 'first',
  second : 'second',
  third  : 'third',
  fourth : 'fourth',
  fifth  : 'fifth'
};

export declare type MockObjType = typeof MockObj;

export const mockValuePossition = [
  {
    obj    : MockObj,
    value  : MockObj.first,
    result : 1,
  }, {
    obj    : MockObj,
    value  : MockObj.third,
    result : 3,
  }, {
    obj    : MockObj,
    value  : MockObj.fifth,
    result : 5,
  }, {
    obj    : MockObj,
    value  : 'Any',
    result : 0
  },
];

export const mockMajorStatus = [
  {
    obj       : MockObj,
    curStatus : MockObj.first,
    newStatus : MockObj.fourth,
    result    : MockObj.fourth
  }, {
    obj       : MockObj,
    curStatus : MockObj.fifth,
    newStatus : MockObj.fourth,
    result    : MockObj.fifth
  }, {
    obj       : MockObj,
    curStatus : MockObj.third,
    newStatus : MockObj.third,
    result    : MockObj.third
  }
];
