import { TestQuestionType } from '../../../types';


export const getExplanation = (
  question    : TestQuestionType,
  isSubmitted : boolean
): string | null => {
  // Показываем подсказку только после submit
  if (! isSubmitted) return null;

  const correctOption = question.options[question.correctAnswer];
  return `💡 Подсказка: Правильный ответ - "${correctOption}"`;
};
