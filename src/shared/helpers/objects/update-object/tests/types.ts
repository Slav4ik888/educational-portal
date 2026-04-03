
interface MockItem {
  description   : string;
  prevObj       : object;
  updatedFields : object;
}


type ResultItem = object;


interface Mock extends Array<MockItem | ResultItem> {
  0: MockItem;
  1: ResultItem;
}


export type Mocks = Array<Mock>;
