import { FC } from 'react';
import { TestQuestion } from '../../types';
import { getExplanation, getLearningExplanation } from './util';
import styles from './index.module.scss';



interface Props {
  isAnswerCorrect  : boolean
  question         : TestQuestion
  isSubmitted      : boolean
  showResult?      : boolean
  showExplanation? : boolean
}

/**
 * Поясняющая надпись правильного ответа
 * Показываем только после submit и неверного ответа
 */
export const Explanation: FC<Props> = ({
  isAnswerCorrect,
  question,
  isSubmitted,
  showResult = true,
  showExplanation = true
}) => {
  if (isAnswerCorrect || ! isSubmitted) return null;

  // Простое объяснение
  const explanation = getExplanation(question)

  // Расширенное объяснение для режима обучения
  const learningExplanation = getLearningExplanation(question)

  if (! explanation) return null;

  return (
    <div className={styles.explanation}>
      {/* Объяснение после ответа */}
      {showResult && showExplanation && explanation && (
        <>
          <div className={styles.explanationIcon}>💡</div>
          <div className={styles.explanationText}>{explanation}</div>
        </>
      )}

      {/* Подсказка до ответа (опционально) */}
      {/* {!showResult && (
        <button
          className={styles.hintButton}
          onClick={() => alert(getShortExplanation(question))}
        >
          🔍 Подсказка
        </button>
      )} */}
    </div>
  );
};
