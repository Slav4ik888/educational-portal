import { FC } from 'react';
import styles from './index.module.scss';



interface Props {
  onClick: () => void
}

export const TestRetryBtn: FC<Props> = ({ onClick }) => (
  <button
    type      = 'button'
    className = {styles.retryButton}
    onClick   = {onClick}
  >
    🔄 Пройти тест заново
  </button>
);
