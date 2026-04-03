
interface MockItem {
  description : string;
  arr1        : Array<any>;
  arr2        : Array<any>;
}

type MockResult = boolean;

interface Mock extends Array<MockItem | MockResult> {
  0: MockItem;
  1: MockResult;
}

export type Mocks = Array<Mock>;
