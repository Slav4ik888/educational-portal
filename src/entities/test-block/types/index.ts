export type TestType = 'final' | 'inline'

/** Базовый тип для всех вопросов */
export interface BaseQuestion {
  id           : string
  text         : string
  points       : number // количество баллов за вопрос
  explanation? : string // объяснение после ответа
}


/** Multiple Choice (один или несколько ответов) */
export interface MultipleChoiceQuestion extends BaseQuestion {
  type           : 'multiple-choice'
  options        : string[]
  correctAnswers : number[] // массив индексов правильных ответов
  allowMultiple  : boolean // true - несколько, false - один
}


/** True/False с объяснением */
export interface TrueFalseQuestion extends BaseQuestion {
  type          : 'true-false'
  correctAnswer : boolean
  explanation   : string // обязательное объяснение
}


/** Fill in the Blank */
export interface BlankField {
  id            : string
  correctAnswer : string
  alternatives? : string[] // возможные варианты
}

export interface FillBlankQuestion extends BaseQuestion {
  type           : 'fill-blank'
  textWithBlanks : string // "React был создан в ___ году компанией ___"
  blanks         : BlankField[] // позиции пропусков
  caseSensitive  : boolean
}



/** Match Pairs (drag & drop или select) */
export interface MatchLeftItem {
  id      : string
  text    : string
  matchId : string  // id элемента из rightItems, с которым нужно сопоставить
}

export interface MatchRightItem {
  id      : string
  text    : string
  // НЕТ matchId!
}

export interface MatchPairsQuestion extends BaseQuestion {
  type            : 'match-pairs'
  leftItems       : MatchLeftItem[]    // левая колонка (содержит matchId)
  rightItems      : MatchRightItem[]  // правая колонка (просто элементы для сопоставления)
  // Для частичной оценки
  scoringType     : 'exact' | 'partial' | 'points-per-match'
  pointsPerMatch? : number
}


/** Order Steps */
export interface Step {
  id           : string
  text         : string
  description? : string
}

export interface OrderStepsQuestion extends BaseQuestion {
  type         : 'order-steps'
  steps        : Step[]
  correctOrder : string[] // массив id шагов в правильном порядке
}


/** AI-оцениваемые вопросы: студент пишет развёрнутый ответ, оценивается нейросетью */

/** Объясни развёрнуто */
export interface FreeResponseQuestion extends BaseQuestion {
  type               : 'free-response'
  evaluationCriteria : string
  exampleAnswer?     : string
}

/** Объясни простыми словами (ELI5) */
export interface ExplainLikeImFiveQuestion extends BaseQuestion {
  type               : 'explain-like-im-five'
  evaluationCriteria : string
  targetAudience     : string
}

/** Объясни другу */
export interface TeachBackQuestion extends BaseQuestion {
  type               : 'teach-back'
  evaluationCriteria : string
  forbiddenTerms?    : string[]
}

/** Приведи свой пример */
export interface GiveYourExampleQuestion extends BaseQuestion {
  type               : 'give-your-example'
  evaluationCriteria : string
  domain?            : string
}

/** Найди ошибку в рассуждении */
export interface DebugTheLogicQuestion extends BaseQuestion {
  type               : 'debug-the-logic'
  reasoning          : string
  errorLocation?     : string
  evaluationCriteria : string
}

/** Объединенный тип */
export type TestQuestion =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | FillBlankQuestion
  | MatchPairsQuestion
  | OrderStepsQuestion
  | FreeResponseQuestion
  | ExplainLikeImFiveQuestion
  | TeachBackQuestion
  | GiveYourExampleQuestion
  | DebugTheLogicQuestion

/** Типы вопросов, оцениваемых AI */
export const TEST_AI_EVALUATED_TYPES = new Set<string>([
  'free-response',
  'explain-like-im-five',
  'teach-back',
  'give-your-example',
  'debug-the-logic',
])

export type AiEvaluatedTestQuestion =
  | FreeResponseQuestion
  | ExplainLikeImFiveQuestion
  | TeachBackQuestion
  | GiveYourExampleQuestion
  | DebugTheLogicQuestion

/** AI question type union */
export type AiQuestionType =
  | 'free-response'
  | 'explain-like-im-five'
  | 'teach-back'
  | 'give-your-example'
  | 'debug-the-logic'

/** AI answer shape shared by all AI-evaluated questions */
export interface AiTestUserAnswer {
  questionId     : string
  type           : AiQuestionType
  value          : string
  aiScore?       : number
  isEvaluated?   : boolean
  aiFeedback?    : string
  aiStrengths?   : string
  aiImprovements?: string
}

/** Type guard: narrows a TestQuestion to an AI-evaluated question */
export function isAiQuestion(q: TestQuestion): q is AiEvaluatedTestQuestion {
  return TEST_AI_EVALUATED_TYPES.has(q.type)
}

/** Расширенный тип для ответов пользователя */
export type TestUserAnswer =
  | { questionId: string; type: 'multiple-choice';       value: number[] }
  | { questionId: string; type: 'true-false';             value: boolean }
  | { questionId: string; type: 'fill-blank';             value: Record<string, string> }
  | { questionId: string; type: 'match-pairs';            value: Record<string, string> }
  | { questionId: string; type: 'order-steps';            value: string[] }
  | { questionId: string; type: 'free-response';          value: string; aiScore?: number; isEvaluated?: boolean; aiFeedback?: string; aiStrengths?: string; aiImprovements?: string }
  | { questionId: string; type: 'explain-like-im-five';   value: string; aiScore?: number; isEvaluated?: boolean; aiFeedback?: string; aiStrengths?: string; aiImprovements?: string }
  | { questionId: string; type: 'teach-back';             value: string; aiScore?: number; isEvaluated?: boolean; aiFeedback?: string; aiStrengths?: string; aiImprovements?: string }
  | { questionId: string; type: 'give-your-example';      value: string; aiScore?: number; isEvaluated?: boolean; aiFeedback?: string; aiStrengths?: string; aiImprovements?: string }
  | { questionId: string; type: 'debug-the-logic';        value: string; aiScore?: number; isEvaluated?: boolean; aiFeedback?: string; aiStrengths?: string; aiImprovements?: string }

export type TestUserAnswers = Record<string, TestUserAnswer>

/** Результат проверки вопроса */
export interface QuestionResult {
  questionId : string
  isCorrect  : boolean
  score      : number
  maxScore   : number
  feedback?  : string
  details?   : {
    correct?          : any
    userAnswer?       : any
    partiallyCorrect? : boolean
    correctMatches?   : number
    totalMatches?     : number
  }
}
