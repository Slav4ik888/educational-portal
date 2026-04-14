import { FC } from 'react';
import { llmGlossaryTerms } from 'entities/glossary';
import { RichTextRenderer } from 'shared/ui/rich-text-render';
import styles from './theory-block.module.scss';



interface TheoryBlockProps {
  content: string
}

export const TheoryBlock: FC<TheoryBlockProps> = ({ content }) => (
  <div className={styles.theoryBlock}>
    <div className={styles.theoryContent}>
      <RichTextRenderer
        text          = {content}
        glossaryTerms = {llmGlossaryTerms}  // Просто передаём термины
      />
    </div>
  </div>
);
