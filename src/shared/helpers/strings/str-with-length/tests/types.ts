
interface MockItem {
  str    : any
  length : any
}

interface Mock extends Array<MockItem | string> {
  0: MockItem
  1: string
}

export type Mocks = Mock[];
