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


/** Объединенный тип */
export type TestQuestion =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | FillBlankQuestion
  | MatchPairsQuestion
  | OrderStepsQuestion

/** Расширенный тип для ответов пользователя */
export type TestUserAnswer =
  | { questionId: string; type: 'multiple-choice'; value: number[] }
  | { questionId: string; type: 'true-false';      value: boolean }
  | { questionId: string; type: 'fill-blank';      value: Record<string, string> }
  | { questionId: string; type: 'match-pairs';     value: Record<string, string> }
  | { questionId: string; type: 'order-steps';     value: string[] }

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
