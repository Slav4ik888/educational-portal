import { Errors, Validation } from '../../../types'

interface MockItem {
  description : string
  data        : Errors
}

type MockResult = Validation

interface Mock extends Array<MockItem | MockResult> {
  0: MockItem
  1: MockResult
}

export type Mocks = Mock[]
