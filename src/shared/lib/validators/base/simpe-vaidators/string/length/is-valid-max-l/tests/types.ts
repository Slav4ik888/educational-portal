
interface MockItem {
  description : string
  maxLength   : number
  str         : string
}

type MockResult = boolean

interface Mock extends Array<MockItem | MockResult> {
  0: MockItem
  1: MockResult
}

export type Mocks = Mock[]
