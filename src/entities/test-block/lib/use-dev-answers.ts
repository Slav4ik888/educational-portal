import { useEffect, useState } from 'react'
import { TestQuestion, TestUserAnswer } from '../types'
import {
  generateCorrectAnswers, generatePartialAnswers, loadMockAnswersFromLocalStorage
} from '../utils'



interface UseDevAnswersOptions {
  enabled?          : boolean // Включен ли режим разработки (например, по env переменной)
  correctnessRatio? : number  // 0-1, процент правильных ответов
  useLocalStorage?  : boolean // Использовать сохраненные ответы
}

/**
 * Хук для разработки - автоматически заполняет ответы на тесты
 */
export function useDevAnswers(
  questions : TestQuestion[],
  options   : UseDevAnswersOptions = {}
): Record<string, TestUserAnswer> | null {
  const {
    enabled = process.env.NODE_ENV === 'development',
    correctnessRatio = 1, // По умолчанию все правильные
    useLocalStorage = false
  } = options

  const [answers, setAnswers] = useState<Record<string, TestUserAnswer> | null>(null)

  useEffect(() => {
    if (!enabled || !questions.length) {
      setAnswers(null)
      return
    }

    // Сначала пробуем загрузить из localStorage
    // if (useLocalStorage) {
    //   const saved = loadMockAnswersFromLocalStorage()
    //   if (saved) {
    //     setAnswers(saved)
    //     return
    //   }
    // }

    // Генерируем новые ответы
    const mockAnswers = correctnessRatio === 1
      ? generateCorrectAnswers(questions)
      : generatePartialAnswers(questions, correctnessRatio)

    setAnswers(mockAnswers)
  }, [questions, enabled, correctnessRatio, useLocalStorage])

  return answers
}
