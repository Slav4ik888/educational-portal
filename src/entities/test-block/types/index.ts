export interface TestQuestionType {
  id            : string
  text          : string
  options       : string[]
  correctAnswer : number
}

export type TestUserAnswers = Record<string, number>
