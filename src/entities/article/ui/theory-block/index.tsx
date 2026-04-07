import { FC, useState } from 'react';
import { RichTextRenderer } from 'shared/ui/rich-text-render';
import styles from './theory-block.module.scss';



interface TheoryBlockProps {
  content     : string
  isCompleted : boolean
  // onComplete  : () => void
}

export const TheoryBlock: FC<TheoryBlockProps> = ({ content, isCompleted }) => {
  const [isMarkedCompleted, setIsMarkedCompleted] = useState(isCompleted);

  const handleComplete = () => {
    if (! isMarkedCompleted) {
      setIsMarkedCompleted(true);
      // onComplete();
    }
  };

  return (
    <div className={styles.theoryBlock}>
      <div className={styles.theoryContent}>
        <RichTextRenderer text={content} />
      </div>

      {/* {! isMarkedCompleted && (
        <button
          type='button'
          className={styles.markCompleteButton}
          onClick={handleComplete}
        >
          ✓ Отметить как пройденное
        </button>
      )} */}

      {isMarkedCompleted && (
        <div className={styles.completedIndicator}>
          ✓ Материал изучен
        </div>
      )}
    </div>
  );
};
