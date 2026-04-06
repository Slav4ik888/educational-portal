import { FC } from 'react';
import { TestQuestionType } from '../../../types';
import { getExplanation } from './util';
import styles from './index.module.scss';



interface Props {
  isAnswerCorrect : boolean
  question        : TestQuestionType
  isSubmitted     : boolean
}

/**
 * Поясняющая надпись правильного ответа
 * Показываем только после submit и неверного ответа
 */
export const Explanation: FC<Props> = ({ isAnswerCorrect, question, isSubmitted }) => {
  if (isAnswerCorrect) return null;

  const explanation = getExplanation(question, isSubmitted);

  if (! explanation) return null;

  return (
    <div className={styles.explanation}>
      {explanation}
    </div>
  );
};
