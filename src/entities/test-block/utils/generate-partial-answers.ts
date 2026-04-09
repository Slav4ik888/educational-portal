/* eslint-disable no-use-before-define */
import {
  TestQuestion,
  TestUserAnswer,
  MultipleChoiceQuestion,
  TrueFalseQuestion,
  FillBlankQuestion,
  MatchPairsQuestion,
  OrderStepsQuestion
} from '../types/index'
import { getCorrectAnswerForQuestion } from './generate-correct-answers'


// ============================================
// Дополнительные утилиты для разработки
// ============================================

/**
 * Генерирует частично правильные ответы (для тестирования UI)
 * @param questions - массив вопросов
 * @param correctnessRatio - процент правильных ответов (0-1)
 */
export function generatePartialAnswers(
  questions: TestQuestion[],
  correctnessRatio: number = 0.5
): Record<string, TestUserAnswer> {
  const answers: Record<string, TestUserAnswer> = {}

  questions.forEach(question => {
    const random = Math.random()
    if (random < correctnessRatio) {
      // Правильный ответ
      const correctAnswer = getCorrectAnswerForQuestion(question)
      if (correctAnswer) answers[question.id] = correctAnswer
    } else {
      // Неправильный ответ
      const wrongAnswer = getWrongAnswerForQuestion(question)
      if (wrongAnswer) answers[question.id] = wrongAnswer
    }
  })

  return answers
}

/**
 * Генерирует неправильный ответ для вопроса
 */
function getWrongAnswerForQuestion(question: TestQuestion): TestUserAnswer | null {
  switch (question.type) {
    case 'multiple-choice':
      return getWrongMultipleChoiceAnswer(question)

    case 'true-false':
      return {
        questionId: question.id,
        type: 'true-false',
        value: !question.correctAnswer
      }

    case 'fill-blank':
      return getWrongFillBlankAnswer(question)

    case 'match-pairs':
      return getWrongMatchPairsAnswer(question)

    case 'order-steps':
      return getWrongOrderStepsAnswer(question)

    default:
      return null
  }
}

/**
 * Неправильный ответ для Multiple Choice (выбирает первый неправильный вариант)
 */
function getWrongMultipleChoiceAnswer(question: MultipleChoiceQuestion): TestUserAnswer {
  const allIndices = Array.from({ length: question.options.length }, (_, i) => i)
  const wrongIndices = allIndices.filter(i => !question.correctAnswers.includes(i))

  // Если есть неправильные варианты, выбираем первый
  const wrongAnswer = wrongIndices.length > 0 ? [wrongIndices[0]] : [0]

  return {
    questionId: question.id,
    type: 'multiple-choice',
    value: wrongAnswer
  }
}

/**
 * Неправильный ответ для Fill Blank (заполняет все поля неправильными значениями)
 */
function getWrongFillBlankAnswer(question: FillBlankQuestion): TestUserAnswer {
  const wrongAnswers: Record<string, string> = {}

  question.blanks.forEach(blank => {
    // Используем альтернативы если есть, иначе просто "wrong"
    if (blank.alternatives && blank.alternatives.length > 0) {
      // eslint-disable-next-line prefer-destructuring
      wrongAnswers[blank.id] = blank.alternatives[0]
    } else {
      wrongAnswers[blank.id] = `wrong_${blank.correctAnswer}`
    }
  })

  return {
    questionId: question.id,
    type: 'fill-blank',
    value: wrongAnswers
  }
}

/**
 * Неправильный ответ для Match Pairs (сдвигает все пары на один)
 */
function getWrongMatchPairsAnswer(question: MatchPairsQuestion): TestUserAnswer {
  const wrongMatches: Record<string, string> = {}
  const rightItems = [...question.rightItems]

  question.leftItems.forEach((leftItem, index) => {
    // Сдвигаем соответствие на один элемент
    const nextIndex = (index + 1) % rightItems.length
    wrongMatches[leftItem.id] = rightItems[nextIndex].id
  })

  return {
    questionId: question.id,
    type: 'match-pairs',
    value: wrongMatches
  }
}

/**
 * Неправильный ответ для Order Steps (переворачивает порядок)
 */
function getWrongOrderStepsAnswer(question: OrderStepsQuestion): TestUserAnswer {
  return {
    questionId: question.id,
    type: 'order-steps',
    value: [...question.correctOrder].reverse()
  }
}
