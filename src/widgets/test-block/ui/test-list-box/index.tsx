import { FC } from 'react';
import { TestQuestionType, TestType, isFinalCompleted, isTestCompleted } from 'entities/test-block';
import { TestCheckBtn } from '../test-block/check-btn';
import { TestRetryBtn } from '../test-block/retry-btn';
import { TestBox } from '../test-box';
import styles from './index.module.scss';



interface Props {
  type            : TestType
  questions       : TestQuestionType[]
  isRetry         : boolean
  isSubmitted     : boolean
  answers         : Record<string, number>
  score           : number | null
  onAnswerChange  : (questionId: string, answerIndex: number) => void
  onRetry         : () => void
  onSubmit        : () => void
}

export const TestListBox: FC<Props> = ({
  answers, type, questions, isRetry, isSubmitted, score,
  onAnswerChange, onRetry, onSubmit
}) => {
  const isPassed = type === 'final' ? isFinalCompleted(score) : isTestCompleted(score);

  if (isPassed) return null;

  const hasWrongAnswers = isSubmitted && score !== null && score < 100;

  return (
    <>
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

      {isSubmitted && hasWrongAnswers && <TestRetryBtn onClick={onRetry} />}
      {! isSubmitted && <TestCheckBtn
        disabled = {Object.keys(answers).length !== questions.length}
        onClick  = {onSubmit}
      />}
    </>
  );
};
