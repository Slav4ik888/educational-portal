
interface MockItem {
  arr  : Array<any> | any;
  item : any;
}

// interface MockResult {
//   data: string;
// }

interface Mock extends Array<MockItem | boolean> {
  0: MockItem;
  1: boolean;
}

export type Mocks = Array<Mock>;
