
interface O {
  [x: string]: string;
}

type MockItem = {
  description : string;
  arr         : Array<O>;
  field       : string;
  regexp      : RegExp;
};

type ResultItem = Array<O>;

interface Mock extends Array<MockItem | ResultItem> {
  0: MockItem;
  1: ResultItem;
}

export type Mocks = Array<Mock>;
