
interface MockItem {
  length : number;
  char?  : string;
}

type ResultItem = string;

interface Mock extends Array<MockItem | ResultItem> {
  0: MockItem,
  1: ResultItem
}

export type Mocks = Array<Mock>;
