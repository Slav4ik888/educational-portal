
interface MockItem<O> {
  description : string;
  stored      : O;
  updated     : Partial<O>;
}

type MockResult<O> = Partial<O>;

interface Mock<O> extends Array<MockItem<O> | MockResult<O>> {
  0: MockItem<O>;
  1: MockResult<O>;
}

export type Mocks = Array<Mock<object>>;
