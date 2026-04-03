
type T = object;

interface MockItem<T> {
  obj        : T,
  lastChange : string
}


interface Mock extends Array<MockItem<T> | T> {
  0: MockItem<T>;
  1: T;
}

export type Mocks = Array<Mock>;
