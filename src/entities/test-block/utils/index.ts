import { TestQuestionType, TestUserAnswers } from '../types';

export const getRightAnswers = (questions: TestQuestionType[]): TestUserAnswers => {
  const answers: Record<string, number> = {};
  questions.forEach(question => {
    answers[question.id] = question.correctAnswer;
  });

  return answers
};

export const isTestCompleted = (score: number | null) => Boolean(score === 100);
export const isFinalCompleted = (score: number | null) => Boolean(score && score >= 70);
