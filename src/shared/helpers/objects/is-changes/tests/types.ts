
interface MockItem<O extends object> {
  prevObj : O;
  newObj  : O;
}

interface Mock extends Array<MockItem<any> | boolean> {
  0: MockItem<any>;
  1: boolean;
}

export type Mocks = Array<Mock>;
