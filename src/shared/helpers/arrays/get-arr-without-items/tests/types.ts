import type { Item } from '../../types';

export interface MockObjType extends Item {
  id     : string | number,
  field1 : string,
  field2 : string,
}

export type MocksObjType = Array<MockObjType>;


interface MockItem<A> {
  description : string;
  arr         : A[],
  field       : string,
  values      : string[]
}

type MockResult<A> = Array<A> | undefined;

interface Mock<A> extends Array<MockItem<A> | MockResult<A>> {
  0: MockItem<A>;
  1: MockResult<A>;
}

export type Mocks<A extends object> = Array<Mock<A>>;
