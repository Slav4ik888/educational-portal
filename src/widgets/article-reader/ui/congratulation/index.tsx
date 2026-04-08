import { FC } from 'react';
import styles from './index.module.scss';



interface Props {
  finalTestCompleted : boolean
  finalTestScore     : number | null
}


/** Поздравление с завершением */
export const Congratulation: FC<Props> = ({
  finalTestCompleted,
  finalTestScore,
}) => (
  <div className={`${styles.completionMessage} ${! finalTestCompleted ? styles.failed : ''}`}>
    <div className={styles.completionIcon}>
      {
        finalTestScore === 100
          ? '🏆'
          : finalTestCompleted ? '🎓' : '📖'
      }
    </div>
    <h3>Итоговый результат: {(finalTestScore && finalTestScore.toFixed(0)) || 0}%</h3>
    <p>
      {
        finalTestScore === 100
          ? 'Вы успешно завершили изучение статьи!'
          : finalTestCompleted
            ? 'Присутствуют неверные ответы, но вы набрали достаточное количество баллов.'
            : 'К сожалению, вы не прошли тест. Рекомендуем повторить материал и попробовать снова.'
      }
    </p>
  </div>
);
