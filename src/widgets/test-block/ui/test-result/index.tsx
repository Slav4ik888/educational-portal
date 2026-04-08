import { FC } from 'react';
import { TestType } from 'entities/test-block';
import styles from './index.module.scss';



interface Props {
  type        : TestType
  score       : number | null
  isPassed    : boolean
  isSubmitted : boolean
}

export const TestResult: FC<Props> = ({ score, isPassed, isSubmitted }) => {
  if (! isSubmitted && score === null) return null;

  return (
    <div className={styles.testResult}>
      <div className={`${styles.resultIcon} ${isPassed ? styles.passed : styles.failed}`}>
        {isPassed ? '🎉' : '📚'}
      </div>
      <h4>Результат теста: {score && score.toFixed(0)}%</h4>
      <p>
        {isPassed
          ? 'Отлично! Вы успешно прошли тест.'
          : 'Некоторые ответы неверные. Нажмите "Пройти заново", чтобы исправить ошибки.'}
      </p>
    </div>
  );
};
