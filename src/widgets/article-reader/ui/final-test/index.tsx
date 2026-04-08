import { FC } from 'react';
import { FinalTest as FinalTestWidget } from 'widgets/final-test';
import { TestQuestionType } from 'entities/test-block';
import styles from './index.module.scss';



interface Props {
  finalTest           : TestQuestionType[]
  finalTestCompleted  : boolean
  finalTestScore      : number | null
  onFinalTestComplete : (score: number) => void
}


export const FinalTest: FC<Props> = ({
  finalTest = [],
  finalTestCompleted,
  finalTestScore,
  onFinalTestComplete
}) => (
  <div className={`${styles.block} ${styles.finalTestBlock}`}>
    <div className={styles.blockHeader}>
      <div className={styles.blockTitle}>
        <span className={styles.blockNumber}>Итоговый тест</span>
        <span className={styles.blockType}>🎯 Финальная проверка</span>
      </div>
      {finalTestCompleted && (
        <span className={styles.completedBadge}>
          ✓ Пройден ({(finalTestScore && finalTestScore.toFixed(0)) || 0}%)
        </span>
      )}
    </div>

    <div className={styles.blockContent}>
      <FinalTestWidget
        questions   = {finalTest}
        isCompleted = {finalTestCompleted}
        savedScore  = {finalTestScore}
        onComplete  = {onFinalTestComplete}
      />
    </div>
  </div>
);
