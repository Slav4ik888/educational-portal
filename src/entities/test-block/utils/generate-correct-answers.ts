/* eslint-disable no-use-before-define */
import {
  TestQuestion,
  TestUserAnswer,
  MultipleChoiceQuestion,
  TrueFalseQuestion,
  FillBlankQuestion,
  MatchPairsQuestion,
  OrderStepsQuestion
} from '../types'

/**
 * Генерирует объект с правильными ответами для всех вопросов
 * Используется во время разработки для автоматического прохождения тестов
 */
export function generateCorrectAnswers(questions: TestQuestion[]): Record<string, TestUserAnswer> {
  const answers: Record<string, TestUserAnswer> = {}

  questions.forEach(question => {
    const answer = getCorrectAnswerForQuestion(question)
    if (answer) {
      answers[question.id] = answer
    }
  })

  return answers
}

/**
 * Возвращает правильный ответ для конкретного вопроса
 */
export function getCorrectAnswerForQuestion(question: TestQuestion): TestUserAnswer | null {
  switch (question.type) {
    case 'multiple-choice':
      return getMultipleChoiceAnswer(question)

    case 'true-false':
      return getTrueFalseAnswer(question)

    case 'fill-blank':
      return getFillBlankAnswer(question)

    case 'match-pairs':
      return getMatchPairsAnswer(question)

    case 'order-steps':
      return getOrderStepsAnswer(question)

    default:
      console.warn(`Unknown question type: ${(question as any).type}`)
      return null
  }
}

/**
 * Правильные ответы для Multiple Choice
 */
function getMultipleChoiceAnswer(question: MultipleChoiceQuestion): TestUserAnswer {
  return {
    questionId: question.id,
    type: 'multiple-choice',
    value: question.correctAnswers // массив индексов правильных ответов
  }
}

/**
 * Правильные ответы для True/False
 */
function getTrueFalseAnswer(question: TrueFalseQuestion): TestUserAnswer {
  return {
    questionId: question.id,
    type: 'true-false',
    value: question.correctAnswer
  }
}

/**
 * Правильные ответы для Fill in the Blank
 */
function getFillBlankAnswer(question: FillBlankQuestion): TestUserAnswer {
  const blankAnswers: Record<string, string> = {}

  question.blanks.forEach(blank => {
    blankAnswers[blank.id] = blank.correctAnswer
  })

  return {
    questionId: question.id,
    type: 'fill-blank',
    value: blankAnswers
  }
}

/**
 * Правильные ответы для Match Pairs
 */
function getMatchPairsAnswer(question: MatchPairsQuestion): TestUserAnswer {
  const matches: Record<string, string> = {}

  question.leftItems.forEach(leftItem => {
    matches[leftItem.id] = leftItem.matchId
  })

  return {
    questionId: question.id,
    type: 'match-pairs',
    value: matches
  }
}

/**
 * Правильные ответы для Order Steps
 */
function getOrderStepsAnswer(question: OrderStepsQuestion): TestUserAnswer {
  return {
    questionId: question.id,
    type: 'order-steps',
    value: question.correctOrder // массив id шагов в правильном порядке
  }
}
