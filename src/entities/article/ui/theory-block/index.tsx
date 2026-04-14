import { FC, useState } from 'react';
import { llmGlossaryTerms } from 'entities/glossary';
import { RichTextRenderer } from 'shared/ui/rich-text-render';
import styles from './theory-block.module.scss';



interface TheoryBlockProps {
  content         : string
  isCompleted     : boolean
  enableGlossary? : boolean
}

export const TheoryBlock: FC<TheoryBlockProps> = ({ content, isCompleted, enableGlossary }) => {
  const [isMarkedCompleted, setIsMarkedCompleted] = useState(isCompleted);

  return (
    <div className={styles.theoryBlock}>
      <div className={styles.theoryContent}>
        <RichTextRenderer
          text          = {content}
          glossaryTerms = {llmGlossaryTerms}  // Просто передаём термины
        />
      </div>

      {isMarkedCompleted && (
        <div className={styles.completedIndicator}>
          ✓ Материал изучен
        </div>
      )}
    </div>
  );
};
