import { FC } from 'react';
import styles from './index.module.scss';



interface Props {
  disabled : boolean
  onClick  : () => void
}

export const TestCheckBtn: FC<Props> = ({ disabled, onClick }) => (
  <button
    type      = 'button'
    className = {styles.submitButton}
    disabled  = {disabled}
    onClick   = {onClick}
  >
    Проверить тест
  </button>
);
