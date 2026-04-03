
interface MockItem {
  description : string
  field       : string
  wrapper?    : string
}

type MockResult = string

interface Mock extends Array<MockItem | MockResult> {
  0: MockItem
  1: MockResult
}

export type Mocks = Array<Mock>
