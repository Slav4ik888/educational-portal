
interface MockItem<A> {
  description : string;
  arr         : Array<A>;
  fieldArr    : string;
  value       : string;
}

type MockResult<A> = Array<A>;

interface Mock<A> extends Array<MockItem<A> | MockResult<A>> {
  0: MockItem<A>;
  1: MockResult<A>;
}
export type Mocks<A> = Array<Mock<A>>;
