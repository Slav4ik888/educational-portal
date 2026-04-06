import { TestQuestionType } from '../../types';


export const isAnswerCorrect = (
  question    : TestQuestionType,
  userAnswer  : number | undefined,
): boolean => {
  if (userAnswer === undefined) return false;
  return userAnswer === question.correctAnswer;
};
