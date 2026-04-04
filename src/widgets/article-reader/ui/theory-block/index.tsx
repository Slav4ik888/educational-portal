import { FC, useState } from 'react';
import styles from './theory-block.module.scss';



interface TheoryBlockProps {
  content: string;
  onComplete: () => void;
}

export const TheoryBlock: FC<TheoryBlockProps> = ({ content, onComplete }) => {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleMarkAsRead = () => {
    setIsCompleted(true);
    onComplete();
  };

  return (
    <div className={styles.theoryBlock}>
      <div className={styles.content}>
        {content.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      {!isCompleted && (
        <button
          type      = 'button'
          className = {styles.completeButton}
          onClick   = {handleMarkAsRead}
        >
          Я прочитал(а) и понял(а) материал ✓
        </button>
      )}

      {isCompleted && (
        <div className={styles.completedBadge}>
          ✓ Блок пройден
        </div>
      )}
    </div>
  );
};
