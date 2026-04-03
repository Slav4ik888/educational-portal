export interface Item {
  id    : string,
  name  : string,
  value : boolean,
  data  : {
    foo: string,
    bae: number
  },
  arr?  : string[]
}

export interface Entities<O extends object> {
  [id: string]: O
}

interface MockItem<O extends object> {
  description : string;
  entities    : Entities<O>;
  field       : string;
  value       : string | string[];
  includes?   : boolean;
  // eslint-disable-next-line
  validFunc?  : Function;
}

type MockResult<O extends object> = Entities<O>;

interface Mock<O extends object> extends Array<MockItem<O> | MockResult<O>> {
  0: MockItem<O>;
  1: MockResult<O>;
}

export type Mocks<O extends object> = Array<Mock<O>>;
