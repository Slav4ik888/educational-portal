export type ActivityType =
  | 'multiple-choice'
  | 'true-false'
  | 'fill-blank'
  | 'free-response'
  | 'explain-like-im-five'
  | 'teach-back'
  | 'give-your-example'
  | 'debug-the-logic'

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
  type               : 'free-response'
  evaluationCriteria : string
  exampleAnswer?     : string
}

/** Объясни как будто тебе 5 лет — без терминов, простыми словами */
export interface ExplainLikeImFiveActivity extends BaseActivity {
  type               : 'explain-like-im-five'
  evaluationCriteria : string
  targetAudience     : string  // например: "ребёнку 10 лет"
}

/** Объясни другу, который ничего не знает о теме */
export interface TeachBackActivity extends BaseActivity {
  type               : 'teach-back'
  evaluationCriteria : string
  forbiddenTerms?    : string[]  // термины, которые нельзя использовать
}

/** Приведи собственный пример из жизни/практики */
export interface GiveYourExampleActivity extends BaseActivity {
  type               : 'give-your-example'
  evaluationCriteria : string
  domain?            : string  // например: "из повседневной жизни"
}

/** Найди ошибку в рассуждении */
export interface DebugTheLogicActivity extends BaseActivity {
  type               : 'debug-the-logic'
  reasoning          : string  // текст с логической ошибкой
  errorLocation?     : string  // где именно ошибка (для AI)
  evaluationCriteria : string
}

export type JourneyActivity =
  | MultipleChoiceActivity
  | TrueFalseActivity
  | FillBlankActivity
  | FreeResponseActivity
  | ExplainLikeImFiveActivity
  | TeachBackActivity
  | GiveYourExampleActivity
  | DebugTheLogicActivity

export type AiEvaluatedActivity =
  | FreeResponseActivity
  | ExplainLikeImFiveActivity
  | TeachBackActivity
  | GiveYourExampleActivity
  | DebugTheLogicActivity

export const AI_EVALUATED_TYPES = new Set<ActivityType>([
  'free-response',
  'explain-like-im-five',
  'teach-back',
  'give-your-example',
  'debug-the-logic',
])

export interface Checkpoint {
  id          : string
  concept     : string
  explanation : string
  order       : number
  activities  : JourneyActivity[]
  timeLimit   : number
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
  | number[]               // multiple-choice
  | boolean                // true-false
  | Record<string, string> // fill-blank
  | string                 // all text-response types

export interface ActivityAnswer {
  activityId   : string
  type         : ActivityType
  value        : ActivityAnswerValue
  aiScore?     : number | null
  aiFeedback?  : string | null
  aiStrengths? : string | null
  aiImprovements? : string | null
  isEvaluated? : boolean
}

export type ActivityAnswers = Record<string, ActivityAnswer>
