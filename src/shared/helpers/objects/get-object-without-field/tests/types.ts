
type T = any;

interface MockItem {
  obj     : T;
  field1  : string;
  field2? : string;
}

type ResultItem = Partial<T>;

interface Mock extends Array<MockItem | ResultItem> {
  0: MockItem;
  1: ResultItem;
}

export type Mocks = Array<Mock>;
