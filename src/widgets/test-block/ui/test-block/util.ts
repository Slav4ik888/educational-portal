/* eslint-disable no-use-before-define */
import {
  TestQuestion,
  TestUserAnswer,
  MultipleChoiceQuestion,
  TrueFalseQuestion,
  FillBlankQuestion,
  MatchPairsQuestion,
  OrderStepsQuestion
} from 'entities/test-block'

/**
 * Проверяет, правильный ли ответ дал пользователь
 * @param question - вопрос, на который отвечают
 * @param userAnswer - ответ пользователя
 * @returns true если ответ полностью правильный, false в противном случае
 */
export const isAnswerCorrect = (
  question: TestQuestion,
  userAnswer: TestUserAnswer
): boolean => {
  // Если ответа нет - он не может быть правильным
  if (!userAnswer) return false

  // Проверяем, что ID вопроса совпадают
  if (question.id !== userAnswer.questionId) return false

  // В зависимости от типа вопроса вызываем соответствующую проверку
  switch (question.type) {
    case 'multiple-choice':
      return isMultipleChoiceCorrect(question, userAnswer)

    case 'true-false':
      return isTrueFalseCorrect(question, userAnswer)

    case 'fill-blank':
      return isFillBlankCorrect(question, userAnswer)

    case 'match-pairs':
      return isMatchPairsCorrect(question, userAnswer)

    case 'order-steps':
      return isOrderStepsCorrect(question, userAnswer)

    default:
      console.warn(`Unknown question type: ${(question as any).type}`)
      return false
  }
}

/**
 * Проверка Multiple Choice вопроса
 */
const isMultipleChoiceCorrect = (
  question: MultipleChoiceQuestion,
  userAnswer: TestUserAnswer
): boolean => {
  // Проверяем тип ответа
  if (userAnswer.type !== 'multiple-choice') return false

  const userAnswers = userAnswer.value;
  const { correctAnswers } = question;

  // Если количество ответов не совпадает - сразу false
  if (userAnswers.length !== correctAnswers.length) return false

  // Сортируем и сравниваем массивы
  const sortedUser = [...userAnswers].sort((a, b) => a - b)
  const sortedCorrect = [...correctAnswers].sort((a, b) => a - b)

  return sortedUser.every((answer, index) => answer === sortedCorrect[index])
}

/**
 * Проверка True/False вопроса
 */
const isTrueFalseCorrect = (
  question: TrueFalseQuestion,
  userAnswer: TestUserAnswer
): boolean => {
  // Проверяем тип ответа
  if (userAnswer.type !== 'true-false') return false

  return userAnswer.value === question.correctAnswer
}

/**
 * Проверка Fill in the Blank вопроса
 */
const isFillBlankCorrect = (
  question: FillBlankQuestion,
  userAnswer: TestUserAnswer
): boolean => {
  // Проверяем тип ответа
  if (userAnswer.type !== 'fill-blank') return false

  const userBlanks = userAnswer.value

  // Используем метод every вместо цикла for...of и оператора continue
  return question.blanks.every(blank => {
    const userAnswerText = userBlanks[blank.id]

    // Если ответ на пропуск отсутствует
    if (!userAnswerText) return false

    // Нормализуем строки для сравнения (убираем лишние пробелы, приводим к нижнему регистру)
    const normalizedUser = normalizeString(userAnswerText)
    const normalizedCorrect = normalizeString(blank.correctAnswer)

    // Проверяем точное совпадение
    if (normalizedUser === normalizedCorrect) return true

    // Проверяем альтернативные варианты
    if (blank.alternatives) {
      const normalizedAlternatives = blank.alternatives.map(alt => normalizeString(alt))
      if (normalizedAlternatives.includes(normalizedUser)) return true
    }

    // Если ни одно условие не подошло - ответ неправильный
    return false
  })
}

/**
 * Проверка Match Pairs вопроса
 */
const isMatchPairsCorrect = (
  question: MatchPairsQuestion,
  userAnswer: TestUserAnswer
): boolean => {
  // Проверяем тип ответа
  if (userAnswer.type !== 'match-pairs') return false

  const userMatches = userAnswer.value

  // Проверяем, все ли левые элементы сопоставлены с правильными парами
  const allMatchedCorrectly = question.leftItems.every(leftItem => {
    const matchedRightId = userMatches[leftItem.id]

    // Если левый элемент не сопоставлен ни с чем
    if (!matchedRightId) return false

    // Проверяем, правильное ли сопоставление
    return leftItem.matchId === matchedRightId
  })

  if (!allMatchedCorrectly) return false

  // Проверяем, что все левые элементы сопоставлены
  if (Object.keys(userMatches).length !== question.leftItems.length) return false

  return true
}

/**
 * Проверка Order Steps вопроса
 */
const isOrderStepsCorrect = (
  question: OrderStepsQuestion,
  userAnswer: TestUserAnswer
): boolean => {
  // Проверяем тип ответа
  if (userAnswer.type !== 'order-steps') return false

  const userOrder = userAnswer.value

  // Проверяем количество элементов
  if (userOrder.length !== question.correctOrder.length) return false

  // Сравниваем порядок
  return userOrder.every((stepId, index) => stepId === question.correctOrder[index])
}

/**
 * Вспомогательная функция для нормализации строк
 * Убирает лишние пробелы, приводит к нижнему регистру, удаляет знаки препинания
 */
const normalizeString = (str: string): string => str
  .trim()                       // Убираем пробелы в начале и конце
  .toLowerCase()                // Приводим к нижнему регистру
  .replace(/[^\w\sа-яё]/gi, '') // Убираем знаки препинания (опционально)
  .replace(/\s+/g, ' ');        // Заменяем множественные пробелы на один


// ============================================
// Дополнительные полезные функции
// ============================================

/**
 * Проверяет ответ и возвращает детальную информацию о правильности
 */
export const getAnswerDetails = (
  question: TestQuestion,
  userAnswer: TestUserAnswer
): {
  isCorrect: boolean
  details?: {
    correctCount?: number
    totalCount?: number
    wrongMatches?: string[]
    wrongBlanks?: string[]
    partiallyCorrect?: boolean
  }
} => {
  if (!userAnswer || question.id !== userAnswer.questionId) {
    return { isCorrect: false }
  }

  switch (question.type) {
    case 'match-pairs':
      return getMatchPairsDetails(question, userAnswer)

    case 'fill-blank':
      return getFillBlankDetails(question, userAnswer)

    case 'order-steps':
      return getOrderStepsDetails(question, userAnswer)

    default:
      return { isCorrect: isAnswerCorrect(question, userAnswer) }
  }
}

/**
 * Детальная проверка для Match Pairs
 */
const getMatchPairsDetails = (
  question: MatchPairsQuestion,
  userAnswer: TestUserAnswer
) => {
  if (userAnswer.type !== 'match-pairs') {
    return { isCorrect: false }
  }

  let correctCount = 0
  const wrongMatches: string[] = []

  question.leftItems.forEach(leftItem => {
    const matchedRightId = userAnswer.value[leftItem.id]
    if (matchedRightId === leftItem.matchId) {
      correctCount++
    } else if (matchedRightId) {
      wrongMatches.push(leftItem.text)
    }
  })

  const isCorrect = correctCount === question.leftItems.length
  const partiallyCorrect = correctCount > 0 && correctCount < question.leftItems.length

  return {
    isCorrect,
    details: {
      correctCount,
      totalCount: question.leftItems.length,
      wrongMatches,
      partiallyCorrect
    }
  }
}

/**
 * Детальная проверка для Fill Blank
 */
const getFillBlankDetails = (
  question: FillBlankQuestion,
  userAnswer: TestUserAnswer
) => {
  if (userAnswer.type !== 'fill-blank') {
    return { isCorrect: false }
  }

  let correctCount = 0
  const wrongBlanks: string[] = []

  // Используем forEach вместо for...of цикла
  question.blanks.forEach(blank => {
    const userAnswerText = userAnswer.value[blank.id]
    const normalizedUser = normalizeString(userAnswerText || '')
    const normalizedCorrect = normalizeString(blank.correctAnswer)

    const isBlankCorrect = normalizedUser === normalizedCorrect
      || (blank.alternatives?.some(alt => normalizeString(alt) === normalizedUser) ?? false)

    if (isBlankCorrect) {
      correctCount++
    } else {
      wrongBlanks.push(blank.id)
    }
  })

  const isCorrect = correctCount === question.blanks.length
  const partiallyCorrect = correctCount > 0 && correctCount < question.blanks.length

  return {
    isCorrect,
    details: {
      correctCount,
      totalCount: question.blanks.length,
      wrongBlanks,
      partiallyCorrect
    }
  }
}

/**
 * Детальная проверка для Order Steps
 */
const getOrderStepsDetails = (
  question: OrderStepsQuestion,
  userAnswer: TestUserAnswer
) => {
  if (userAnswer.type !== 'order-steps') {
    return { isCorrect: false }
  }

  let correctCount = 0
  for (let i = 0; i < userAnswer.value.length; i++) {
    if (userAnswer.value[i] === question.correctOrder[i]) {
      correctCount++
    }
  }

  const isCorrect = correctCount === question.correctOrder.length
  const partiallyCorrect = correctCount > 0 && correctCount < question.correctOrder.length

  return {
    isCorrect,
    details: {
      correctCount,
      totalCount: question.correctOrder.length,
      partiallyCorrect
    }
  }
}

/**
 * Проверяет, ответил ли пользователь на вопрос (есть ли хоть какой-то ответ)
 */
export const isQuestionAnswered = (
  userAnswer: TestUserAnswer | undefined
): boolean => {
  if (!userAnswer) return false

  switch (userAnswer.type) {
    case 'multiple-choice':
      return userAnswer.value.length > 0

    case 'true-false':
      return userAnswer.value !== undefined

    case 'fill-blank':
      return Object.keys(userAnswer.value).length > 0

    case 'match-pairs':
      return Object.keys(userAnswer.value).length > 0

    case 'order-steps':
      return userAnswer.value.length > 0

    default:
      return false
  }
}
