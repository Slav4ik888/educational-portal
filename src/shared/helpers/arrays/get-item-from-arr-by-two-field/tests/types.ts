import type { Item } from '../..';

interface MockItem {
  arr : Array<Item>,
  ff  : string,
  vf  : number,
  fs  : string,
  vs  : string
}

interface Mock extends Array<MockItem | object> {
  0: MockItem;
  1: object;
}

export type Mocks = Array<Mock>;
