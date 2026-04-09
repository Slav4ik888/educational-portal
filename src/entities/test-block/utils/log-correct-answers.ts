/* eslint-disable no-use-before-define */
import {
  TestQuestion,
  TestUserAnswer,
} from '../types'
import { generateCorrectAnswers, getCorrectAnswerForQuestion } from './generate-correct-answers'


// ============================================
// Утилиты для отладки и логирования
// ============================================

/**
 * Выводит в консоль все правильные ответы в читаемом формате
 */
export function logCorrectAnswers(questions: TestQuestion[]): void {
  console.group('📝 Правильные ответы для теста')

  questions.forEach((question, index) => {
    console.group(`Вопрос ${index + 1}: ${question.text}`)
    console.log('Тип:', question.type)
    console.log('Баллов:', question.points)

    const answer = getCorrectAnswerForQuestion(question)
    // @ts-ignore
    console.log('Правильный ответ:', answer?.value)

    if (question.explanation) {
      console.log('Объяснение:', question.explanation)
    }

    console.groupEnd()
  })

  console.groupEnd()
}

/**
 * Создает объект с ответами для localStorage (для быстрого доступа во время разработки)
 */
export function saveMockAnswersToLocalStorage(questions: TestQuestion[]): void {
  const answers = generateCorrectAnswers(questions)
  localStorage.setItem('dev_mock_answers', JSON.stringify(answers))
  console.log('✅ Mock answers saved to localStorage (key: dev_mock_answers)')
}

/**
 * Загружает mock-ответы из localStorage
 */
export function loadMockAnswersFromLocalStorage(): Record<string, TestUserAnswer> | null {
  const saved = localStorage.getItem('dev_mock_answers')
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse mock answers from localStorage', e)
      return null
    }
  }
  return null
}
