import { FC, useEffect, useState } from 'react';
import { TestResult } from '../test-result/index';
import { TestListBox } from '../test-list-box';
import { cfg } from 'app/config';
import {
  TestQuestionType, TestUserAnswers, getRightAnswers, isTestCompleted, TestType, isFinalCompleted
} from 'entities/test-block';
import styles from './index.module.scss';



interface Props {
  type        : TestType
  questions   : TestQuestionType[]
  isCompleted : boolean
  savedScore  : number | null
  onComplete  : (score: number) => void
}

export const TestBlock: FC<Props> = ({ type, questions, isCompleted, savedScore, onComplete }) => {
  const [answers, setAnswers] = useState<TestUserAnswers>(() => cfg.SET_ANSWERS ? getRightAnswers(questions) : {});
  const [submitted, setSubmitted] = useState(isCompleted);
  const [score, setScore] = useState<number | null>(savedScore || null);
  const [retry, setRetry] = useState<boolean>(false);
  const isFinal = type === 'final';
  // Определяем, есть ли неверные ответы
  const isPassed = isFinal ? isFinalCompleted(score) : isTestCompleted(score);


  // Восстанавливаем сохраненные ответы
  useEffect(() => {
    if (savedScore !== undefined && isCompleted) {
      setSubmitted(true);
      setScore(savedScore);
    }
  }, [savedScore, isCompleted]);

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    if (! submitted) {
      setAnswers((prev: TestUserAnswers) => ({ ...prev, [questionId]: answerIndex }));
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


  return (
    <div className={styles.testBlock}>
      {
        ! isFinal && (
          <TestResult
            type        = 'inline'
            isPassed    = {isPassed}
            isSubmitted = {submitted}
            score       = {score}
          />
        )
      }

      <TestListBox
        type           = 'inline'
        score          = {score}
        isRetry        = {retry}
        isSubmitted    = {submitted}
        answers        = {answers}
        questions      = {questions}
        onAnswerChange = {handleAnswerChange}
        onSubmit       = {handleSubmit}
        onRetry        = {handleRetry}
      />
    </div>
  );
};
