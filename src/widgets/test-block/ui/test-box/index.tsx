import { FC, useState } from 'react';
import { TestQuestionType } from 'entities/test-block';
import { Explanation } from './explanation';
import { isAnswerCorrect as isAnswerCorrectFunc } from './util';
import styles from './index.module.scss';



interface Props {
  isRetry            : boolean // Если нажали для повторного прохождения теста
  isSubmitted        : boolean
  question           : TestQuestionType
  initialAnswerIndex : number | undefined
  onAnswerChange     : (questionId: string, answerIndex: number) => void
}

export const TestBox: FC<Props> = ({ isRetry, isSubmitted, question, initialAnswerIndex, onAnswerChange }) => {
  const [answer, setAnswer] = useState<number | undefined>(initialAnswerIndex);

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    onAnswerChange(questionId, answerIndex);
    setAnswer(answerIndex);
  };


  // Показываем вопрос с подсказкой если был неверный ответ
  const isAnswerCorrect = isAnswerCorrectFunc(question, answer);

  return (
    <>
      <div className={styles.options}>
        {question.options.map((option, optIndex) => {
          let optionClassName = styles.option;

          // Подсвечиваем правильные и неправильные ответы после submit
          if (isSubmitted) {
            if (isAnswerCorrect && optIndex === question.correctAnswer) {
              optionClassName += ` ${styles.correctOption}`;
            }
            if (answer === optIndex && optIndex !== question.correctAnswer) {
              optionClassName += ` ${styles.wrongOption}`;
            }
          }

          return (
            // eslint-disable-next-line jsx-a11y/label-has-associated-control
            <label key={optIndex} className={optionClassName}>
              <input
                type     = 'radio'
                name     = {`question-${question.id}`}
                value    = {optIndex}
                checked  = {answer === optIndex}
                onChange = {() => handleAnswerChange(question.id, optIndex)}
                disabled = {isSubmitted && ! isRetry}
              />
              <span>{option}</span>
              {isAnswerCorrect && (isSubmitted || isRetry) && optIndex === question.correctAnswer && (
                <span className={styles.correctMark}>✓</span>
              )}
              {isSubmitted && answer === optIndex && optIndex !== question.correctAnswer && (
                <span className={styles.wrongMark}>✗</span>
              )}
            </label>
          );
        })}
      </div>

      <Explanation
        question        = {question}
        isAnswerCorrect = {isAnswerCorrect}
        isSubmitted     = {isSubmitted}
      />
    </>
  );
};
