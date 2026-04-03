interface MockItem {
  description : string
  obj         : string | object
}

type MockResult = string

interface Mock extends Array<MockItem | MockResult> {
  0: MockItem
  1: MockResult
}

export type Mocks = Mock[]
