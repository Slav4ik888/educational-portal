import { FC, useEffect, useState } from 'react';
import { TestQuestionType } from '../../types';
import { TestResultCard } from './result-card';
import { TestCheckBtn } from './check-btn';
import { TestRetryBtn } from './retry-btn';
import { TestListBox } from '../test-list-box';
import styles from './index.module.scss';



interface Props {
  questions   : TestQuestionType[]
  isCompleted : boolean
  savedScore? : number
  onComplete  : (score: number) => void
}

export const TestBlock: FC<Props> = ({ questions, isCompleted, savedScore, onComplete }) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(isCompleted);
  const [score, setScore] = useState<number | null>(savedScore || null);
  const [retry, setRetry] = useState<boolean>(false);

  // Восстанавливаем сохраненные ответы
  useEffect(() => {
    if (savedScore !== undefined && isCompleted) {
      setSubmitted(true);
      setScore(savedScore);
    }
  }, [savedScore, isCompleted]);

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    if (! submitted) {
      setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
    }
  };


  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });

    const calculatedScore = (correctCount / questions.length) * 100;
    setScore(calculatedScore);
    setSubmitted(true);
    onComplete(calculatedScore);
    setRetry(false);
  };

  const handleRetry = () => {
    setSubmitted(false);
    setRetry(true);
  };

  // Определяем, есть ли неверные ответы
  const hasWrongAnswers = submitted && score !== null && score < 100;

  const isPassed = score ? score >= 70 : false;

  return (
    <div className={styles.testBlock}>
      <TestResultCard
        isPassed    = {isPassed}
        isSubmitted = {submitted}
        score       = {score}
      />

      <TestListBox
        isPassed       = {isPassed}
        isRetry        = {retry}
        isSubmitted    = {submitted}
        answers        = {answers}
        questions      = {questions}
        onAnswerChange = {handleAnswerChange}
      />

      {submitted && hasWrongAnswers
        ? <TestRetryBtn onClick={handleRetry} /> // Если уже был submit, показываем кнопку для повторной попытки
        : <TestCheckBtn
            disabled = {Object.keys(answers).length !== questions.length}
            onClick  = {handleSubmit}
          />}
    </div>
  );
};
