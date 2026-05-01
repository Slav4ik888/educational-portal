export type ActivityType =
  | 'multiple-choice'
  | 'true-false'
  | 'fill-blank'
  | 'free-response'

export interface BaseActivity {
  id     : string
  type   : ActivityType
  text   : string
  points : number
  hint?  : string | null
}

export interface MultipleChoiceActivity extends BaseActivity {
  type           : 'multiple-choice'
  options        : string[]
  correctAnswers : number[]
  allowMultiple  : boolean
  explanation?   : string
}

export interface TrueFalseActivity extends BaseActivity {
  type          : 'true-false'
  correctAnswer : boolean
  explanation   : string
}

export interface FillBlankActivity extends BaseActivity {
  type           : 'fill-blank'
  textWithBlanks : string
  blanks         : Array<{
    id            : string
    correctAnswer : string
    alternatives? : string[]
  }>
  caseSensitive  : boolean
}

export interface FreeResponseActivity extends BaseActivity {
  type                : 'free-response'
  evaluationCriteria  : string
  exampleAnswer?      : string
}

export type JourneyActivity =
  | MultipleChoiceActivity
  | TrueFalseActivity
  | FillBlankActivity
  | FreeResponseActivity

export interface Checkpoint {
  id          : string
  concept     : string
  explanation : string
  order       : number
  activities  : JourneyActivity[]
  timeLimit   : number // seconds
}

export interface Journey {
  id          : string
  title       : string
  description : string
  topic       : string
  checkpoints : Checkpoint[]
  createdAt   : string
}

export type ActivityAnswerValue =
  | number[]             // multiple-choice: selected option indices
  | boolean              // true-false
  | Record<string, string> // fill-blank: { blankId -> userInput }
  | string               // free-response: text

export interface ActivityAnswer {
  activityId  : string
  type        : ActivityType
  value       : ActivityAnswerValue
  aiScore?    : number | null
  aiFeedback? : string | null
  isEvaluated?: boolean
}

export type ActivityAnswers = Record<string, ActivityAnswer>
