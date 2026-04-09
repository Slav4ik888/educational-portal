import {
  TestQuestion,
  MultipleChoiceQuestion,
  TrueFalseQuestion,
  FillBlankQuestion,
  MatchPairsQuestion,
  OrderStepsQuestion
} from '../../types'

/**
 * Возвращает объяснение для вопроса
 * @param question - вопрос, для которого нужно получить объяснение
 * @returns текст объяснения или null, если объяснение отсутствует
 */
export const getExplanation = (
  question: TestQuestion
): string | null => {
  // Если вопроса нет, возвращаем null
  if (!question) return null

  // Если у вопроса есть свое объяснение, возвращаем его
  if (question.explanation) {
    return question.explanation
  }

  // Для некоторых типов вопросов можно сгенерировать объяснение по умолчанию
  return generateDefaultExplanation(question)
}

/**
 * Генерирует стандартное объяснение для вопроса, если явное не указано
 */
const generateDefaultExplanation = (question: TestQuestion): string | null => {
  switch (question.type) {
    case 'multiple-choice':
      return generateMultipleChoiceExplanation(question)

    case 'true-false':
      return generateTrueFalseExplanation(question)

    case 'fill-blank':
      return generateFillBlankExplanation(question)

    case 'match-pairs':
      return generateMatchPairsExplanation(question)

    case 'order-steps':
      return generateOrderStepsExplanation(question)

    default:
      return null
  }
}

/**
 * Генерирует объяснение для Multiple Choice вопроса
 */
const generateMultipleChoiceExplanation = (
  question: MultipleChoiceQuestion
): string => {
  const isMultiple = question.allowMultiple;
  const { correctAnswers } = question;
  const correctTexts = correctAnswers.map(index => question.options[index]);

  let explanation = `Правильный ответ: ${correctTexts.join(', ')}. `;

  if (isMultiple && correctAnswers.length > 1) {
    explanation += 'Это вопрос с множественным выбором, все указанные варианты верны. ';
  }
  else if (!isMultiple && correctAnswers.length === 1) {
    explanation += 'Это вопрос с единственным правильным ответом. ';
  }

  explanation += `Обоснование: ${getDefaultReasoning(question.text)}`

  return explanation
}

/**
 * Генерирует объяснение для True/False вопроса
 */
const generateTrueFalseExplanation = (
  question: TrueFalseQuestion
): string => {
  const isCorrect = question.correctAnswer
  const answerText = isCorrect ? 'Верно' : 'Неверно'

  return `Правильный ответ: ${answerText}. ${question.explanation || 'Это утверждение основано на материале статьи.'}`
}

/**
 * Генерирует объяснение для Fill Blank вопроса
 */
const generateFillBlankExplanation = (
  question: FillBlankQuestion
): string => {
  const correctAnswers = question.blanks.map(blank => {
    const alternatives = blank.alternatives?.length
      ? ` (или ${blank.alternatives.join(', ')})`
      : ''
    return `"${blank.correctAnswer}"${alternatives}`
  }).join(', ')

  return `Правильные ответы: ${correctAnswers}. ${question.explanation
    || 'Проверьте материал статьи, чтобы найти правильные термины.'}`
}

/**
 * Генерирует объяснение для Match Pairs вопроса
 */
const generateMatchPairsExplanation = (
  question: MatchPairsQuestion
): string => {
  const correctMatches = question.leftItems.map(item => {
    const rightItem = question.rightItems.find(r => r.id === item.matchId)
    return `"${item.text}" → "${rightItem?.text || '?'}"`
  }).join('; ')

  return `Правильные сопоставления: ${correctMatches}. ${question.explanation
    || 'Каждый термин должен быть соединен с правильным определением.'}`
}

/**
 * Генерирует объяснение для Order Steps вопроса
 */
const generateOrderStepsExplanation = (
  question: OrderStepsQuestion
): string => {
  const correctOrder = question.correctOrder.map(stepId => {
    const step = question.steps.find(s => s.id === stepId)
    return step?.text || '?'
  }).join(' → ')

  return `Правильный порядок: ${correctOrder}. ${question.explanation
    || 'Важно соблюдать хронологическую или логическую последовательность.'}`
}

/**
 * Вспомогательная функция для генерации базового обоснования
 */
const getDefaultReasoning = (questionText: string): string => {
  // Можно добавить логику на основе текста вопроса
  if (questionText.toLowerCase().includes('llm')) {
    return 'Это фундаментальное понятие в работе языковых моделей.'
  }
  if (questionText.toLowerCase().includes('токен')) {
    return 'Токенизация — базовый процесс обработки текста в LLM.'
  }
  if (questionText.toLowerCase().includes('внимание') || questionText.toLowerCase().includes('attention')) {
    return 'Механизм внимания — ключевой компонент архитектуры Transformer.'
  }

  return 'Этот ответ основан на материале, изложенном в статье.'
}

// ============================================
// Дополнительные полезные функции
// ============================================

/**
 * Возвращает краткое объяснение (для подсказки)
 */
export const getShortExplanation = (
  question: TestQuestion
): string | null => {
  const explanation = getExplanation(question)
  if (!explanation) return null

  // Обрезаем до 100 символов для краткой подсказки
  if (explanation.length > 100) {
    return `${explanation.substring(0, 97)}...`
  }

  return explanation
}

/**
 * Возвращает объяснение с правильными ответами (для режима обучения)
 */
export const getLearningExplanation = (
  question: TestQuestion
): string => {
  const explanation = getExplanation(question)

  switch (question.type) {
    case 'multiple-choice':
      {
        const correctAnswers = question.correctAnswers.map(i => question.options[i])
        return `✅ Правильный ответ: ${correctAnswers.join(', ')}\n\n📚 ${explanation || 'Изучите материал еще раз.'}`
      }

    case 'true-false':
      return `✅ Правильный ответ: ${question.correctAnswer ? 'Верно' : 'Неверно'}\n\n📚 ${explanation
        || question.explanation || 'Обратите внимание на ключевые моменты в тексте.'}`

    case 'fill-blank': {
      const blanks = question
        .blanks.map((blank, i) => `Пропуск ${i + 1}: "${blank.correctAnswer}"${blank.alternatives?.length
          ? ` (или ${blank.alternatives.join(', ')})` : ''}`
      ).join('\n');

      return `✅ Правильные ответы:\n${blanks}\n\n📚 ${explanation || 'Проверьте терминологию в статье.'}`
    }
    default:
      return `📚 ${explanation || 'Попробуйте найти ответ в материале статьи.'}`
  }
}

/**
 * Проверяет, есть ли у вопроса объяснение
 */
export const hasExplanation = (
  question: TestQuestion
): boolean => !! question.explanation || !! generateDefaultExplanation(question);


/**
 * Возвращает объяснение на определенном языке (для будущей интернационализации)
 */
export const getExplanationWithLocale = (
  question: TestQuestion,
  locale: string = 'ru'
): string | null => {
  const explanation = getExplanation(question)

  if (!explanation) return null

  // Здесь можно добавить логику перевода
  // Пока просто возвращаем оригинал
  return explanation
}
