import { FC } from 'react';
import { TestQuestionType } from '../../types';
import { TestBox } from '../test-box';
import styles from './index.module.scss';



interface Props {
  isPassed       : boolean
  questions      : TestQuestionType[]
  isRetry        : boolean
  isSubmitted    : boolean
  answers        : Record<string, number>
  onAnswerChange : (questionId: string, answerIndex: number) => void
}

export const TestListBox: FC<Props> = ({ answers, isPassed, questions, isRetry, isSubmitted, onAnswerChange }) => {
  if (isPassed) return null;

  return (
    <div className={styles.questionsList}>
      {questions.map((question, index) => (
        <div
          key={question.id}
          className={styles.question}
        >
          <div className={styles.questionText}>
            {index + 1}. {question.text}
          </div>
          <TestBox
            isRetry            = {isRetry}
            isSubmitted        = {isSubmitted}
            question           = {question}
            initialAnswerIndex = {answers[question.id]}
            onAnswerChange     = {onAnswerChange}
          />
        </div>
      ))}
    </div>
  );
};
