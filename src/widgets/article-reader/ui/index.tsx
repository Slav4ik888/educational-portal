import { FC, useState, useEffect } from 'react';
import { ContentBlock } from 'entities/article';
import { useDispatch, useSelector } from 'react-redux';
import { StateSchema } from 'app/providers/store';
import { userProgressActions } from 'entities/user-progress';
import { TheoryBlock } from './theory-block';
import { TestBlock } from './test-block';
import { ProgressBar } from 'shared/ui/progress-bar';
import styles from './article-reader.module.scss';



interface ArticleReaderProps {
  blocks: ContentBlock[];
  articleId: string;
}


export const ArticleReader: FC<ArticleReaderProps> = ({ blocks, articleId }) => {
  const dispatch = useDispatch();
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [blockResults, setBlockResults] = useState<Record<string, { completed: boolean; score?: number }>>({});

  // Получаем сохраненный прогресс из Redux
  const savedProgress = useSelector((state: StateSchema) => state.userProgress.articlesProgress[articleId]);

  // Восстанавливаем прогресс при загрузке
  useEffect(() => {
    if (savedProgress) {
      setCurrentBlockIndex(savedProgress.lastBlockIndex || 0);
      setBlockResults(savedProgress.blockResults || {});
    }
  },
    [savedProgress]
  );

  const currentBlock = blocks[currentBlockIndex];
  const totalBlocks = blocks.length;
  const completedBlocks = Object.values(blockResults).filter(r => r.completed).length;

  const handleTheoryComplete = (blockId: string) => {
    const newResults = {
      ...blockResults,
      [blockId]: { completed: true },
    };
    setBlockResults(newResults);

    dispatch(userProgressActions.updateBlockProgress({
      articleId,
      blockId,
      completed: true,
    }));

    // Автоматически переходим к следующему блоку
    if (currentBlockIndex < totalBlocks - 1) {
      setCurrentBlockIndex(currentBlockIndex + 1);
    }
  };

  const handleQuizComplete = (blockId: string, score: number, totalQuestions: number) => {
    const percentage = (score / totalQuestions) * 100;
    const newResults = {
      ...blockResults,
      [blockId]: { completed: true, score: percentage },
    };
    setBlockResults(newResults);

    dispatch(userProgressActions.updateBlockProgress({
      articleId,
      blockId,
      completed: true,
      score: percentage,
    }));

    // Переходим к следующему блоку
    if (currentBlockIndex < totalBlocks - 1) {
      setCurrentBlockIndex(currentBlockIndex + 1);
    }
  };

  const handleNextBlock = () => {
    if (currentBlockIndex < totalBlocks - 1) {
      setCurrentBlockIndex(currentBlockIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevBlock = () => {
    if (currentBlockIndex > 0) {
      setCurrentBlockIndex(currentBlockIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleJumpToBlock = (index: number) => {
    if (index <= currentBlockIndex || blockResults[blocks[index].id]?.completed) {
      setCurrentBlockIndex(index);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.articleReader}>
      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <h3>Прогресс изучения</h3>
          <span>{completedBlocks} / {totalBlocks} блоков</span>
        </div>
        <ProgressBar current={completedBlocks} total={totalBlocks} />

        <div className={styles.blockNavigation}>
          {blocks.map((block, index) => (
            <button
              key       = {block.id}
              type      = 'button'
              className = {`${styles.navButton} 
                ${index === currentBlockIndex ? styles.active : ''}
                ${blockResults[block.id]?.completed ? styles.completed : ''}
                ${index > currentBlockIndex && !blockResults[block.id]?.completed ? styles.locked : ''}
              `}
              disabled  = {index > currentBlockIndex && !blockResults[block.id]?.completed}
              onClick   = {() => handleJumpToBlock(index)}
            >
              {blockResults[block.id]?.completed && '✓ '}
              Блок {index + 1}
              {block.type === 'test' && ' 📝'}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.contentSection}>
        <div className={styles.blockContainer}>
          <div className={styles.blockHeader}>
            <span className={styles.blockType}>
              {currentBlock.type === 'theory' ? '📖 Теоретический блок' : '✍️ Тестовый блок'}
            </span>
            <span className={styles.blockNumber}>
              Блок {currentBlockIndex + 1} из {totalBlocks}
            </span>
          </div>

          {currentBlock.type === 'theory' && (
            <TheoryBlock
              content={currentBlock.content}
              onComplete={() => handleTheoryComplete(currentBlock.id)}
            />
          )}

          {currentBlock.type === 'test' && currentBlock.questions && (
            <TestBlock
              questions={currentBlock.questions}
              onComplete={(score, total) => handleQuizComplete(currentBlock.id, score, total)}
            />
          )}
        </div>

        <div className={styles.navigationButtons}>
          <button
            type      = 'button'
            className = {styles.prevButton}
            disabled  = {currentBlockIndex === 0}
            onClick   = {handlePrevBlock}
          >
            ← Предыдущий блок
          </button>

          {currentBlockIndex < totalBlocks - 1 && (
            <button
              type      = 'button'
              className = {styles.nextButton}
              disabled  = {!blockResults[currentBlock.id]?.completed}
              onClick   = {handleNextBlock}
            >
              Следующий блок →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
