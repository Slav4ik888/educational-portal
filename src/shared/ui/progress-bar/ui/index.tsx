import { FC } from 'react';
import styles from './progress-bar.module.scss';


interface ProgressBarProps {
  current : number
  total   : number
}

export const ProgressBar: FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className={styles.progressBar}>
      <div
        className={styles.progressFill}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
