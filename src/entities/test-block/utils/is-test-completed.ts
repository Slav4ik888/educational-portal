
export const isTestCompleted = (score: number | null) => Boolean(score === 100);
export const isFinalCompleted = (score: number | null) => Boolean(score && score >= 70);

// DEPRECATED
// export const getRightAnswers = (questions: TestQuestion[]): TestUserAnswers => {
//   const answers: Record<string, number> = {};
//   questions.forEach(question => {
//     answers[question.id] = question.correctAnswer;
//   });

//   return answers
// };
