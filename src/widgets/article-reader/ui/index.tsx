import { FC, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StateSchema } from 'app/providers/store';
import { userProgressActions } from 'entities/user-progress';
import { TestBlock } from 'entities/test-block';
import { FinalTest } from 'widgets/final-test';
import { ContentBlockType, TheoryBlock } from 'entities/article';
import { decrementString } from '../utils';
import styles from './article-reader.module.scss';



interface ArticleReaderProps {
  blocks: ContentBlockType[];
  finalTest?: Array<{
    id: string;
    text: string;
    options: string[];
    correctAnswer: number;
  }>;
  articleId: string;
}

export const ArticleReader: FC<ArticleReaderProps> = ({
  blocks,
  finalTest = [],
  articleId
}) => {
  const dispatch = useDispatch();
  const [completedBlocks, setCompletedBlocks] = useState<Set<string>>(new Set());
  const [testResults, setTestResults] = useState<Record<string, number>>({});
  const [finalTestCompleted, setFinalTestCompleted] = useState(false);
  const [finalTestScore, setFinalTestScore] = useState<number | null>(null);

  // Получаем сохраненный прогресс из Redux
  const savedProgress = useSelector(
    (state: StateSchema) => state.userProgress.articlesProgress[articleId]
  );

  // Восстанавливаем прогресс при загрузке
  useEffect(() => {
    if (savedProgress) {
      setCompletedBlocks(new Set(savedProgress.completedBlockIds || []));
      setTestResults(savedProgress.testResults || {});
      setFinalTestCompleted(savedProgress.finalTestCompleted || false);
      setFinalTestScore(savedProgress.finalTestScore || null);
    }
  }, [savedProgress]);

  // const handleTheoryComplete = (blockId: string) => {
  //   const newCompleted = new Set(completedBlocks);
  //   newCompleted.add(blockId);
  //   setCompletedBlocks(newCompleted);

  //   dispatch(userProgressActions.updateBlockProgress({
  //     articleId,
  //     blockId,
  //     completed: true,
  //   }));
  // };

  const handleTestComplete = (blockId: string, score: number) => {
    const isCompleted = score === 100;
    if (isCompleted) {
      const newCompleted = new Set(completedBlocks);
      newCompleted.add(blockId);
      setCompletedBlocks(newCompleted);

      const theoryBlockId = decrementString(blockId);
      newCompleted.add(theoryBlockId);

      dispatch(userProgressActions.updateBlockProgress({
        articleId,
        blockId   : theoryBlockId,
        completed : true,
      }));
    }

    setTestResults(prev => ({
      ...prev,
      [blockId]: score,
    }));

    dispatch(userProgressActions.updateBlockProgress({
      articleId,
      blockId,
      completed: isCompleted,
      score,
    }));
  };

  const handleFinalTestComplete = (score: number) => {
    setFinalTestCompleted(score >= 70);
    setFinalTestScore(score);

    dispatch(userProgressActions.updateFinalTestProgress({
      articleId,
      completed: true,
      score,
    }));
  };

  const allBlocksCompleted = blocks.length === completedBlocks.size;
  const hasFinalTest = finalTest.length > 0;
  const isArticleCompleted = hasFinalTest ? finalTestCompleted : allBlocksCompleted;

  return (
    <div className={styles.articleReader}>
      <div className={styles.progressHeader}>
        <h2>Изучение материала</h2>
        <div className={styles.progressStats}>
          <span>Прогресс: {completedBlocks.size} / {blocks.length} блоков</span>
          {hasFinalTest && (
            <span className={finalTestCompleted ? styles.completed : styles.pending}>
              {finalTestCompleted ? '✅ Итоговый тест пройден' : '📝 Итоговый тест ожидает'}
            </span>
          )}
        </div>
      </div>

      <div className={styles.blocksContainer}>
        {/* Теоретические и тестовые блоки */}
        {blocks.map((block, index) => {
          const isCompleted = completedBlocks.has(block.id);

          return (
            <div
              key       = {block.id}
              id        = {`block-${block.id}`}
              className = {`${styles.block} ${isCompleted ? styles.completed : ''}`}
            >
              <div className={styles.blockHeader}>
                <div className={styles.blockTitle}>
                  <span className={styles.blockNumber}>Блок {index + 1}</span>
                  <span className={styles.blockType}>
                    {block.type === 'theory' ? '📖 Теория' : '✍️ Тест'}
                  </span>
                </div>
                {isCompleted && (
                  <span className={styles.completedBadge}>✓ Пройдено</span>
                )}
              </div>

              <div className={styles.blockContent}>
                {block.type === 'theory' && block.content && (
                  <TheoryBlock
                    content     = {block.content}
                    isCompleted = {isCompleted}
                    // onComplete  = {() => handleTheoryComplete(block.id)}
                  />
                )}

                {block.type === 'test' && block.questions && (
                  <TestBlock
                    questions   = {block.questions}
                    isCompleted = {isCompleted}
                    savedScore  = {testResults[block.id]}
                    onComplete  = {(score) => handleTestComplete(block.id, score)}
                  />
                )}
              </div>
            </div>
          );
        })}

        {/* Итоговый тест */}
        {hasFinalTest && (
          <div className={`${styles.block} ${styles.finalTestBlock}`}>
            <div className={styles.blockHeader}>
              <div className={styles.blockTitle}>
                <span className={styles.blockNumber}>Итоговый тест</span>
                <span className={styles.blockType}>🎯 Финальная проверка</span>
              </div>
              {finalTestCompleted && (
                <span className={styles.completedBadge}>
                  ✓ Пройден ({(finalTestScore || 0).toFixed(0)}%)
                </span>
              )}
            </div>

            <div className={styles.blockContent}>
              <FinalTest
                questions   = {finalTest}
                isCompleted = {finalTestCompleted}
                savedScore  = {finalTestScore}
                onComplete  = {handleFinalTestComplete}
              />
            </div>
          </div>
        )}

        {/* Поздравление с завершением */}
        {isArticleCompleted && (
          <div className={styles.completionMessage}>
            <div className={styles.completionIcon}>🏆</div>
            <h3>Поздравляем!</h3>
            <p>
              Вы успешно завершили изучение статьи!
              {finalTestScore && ` Ваш результат: ${finalTestScore.toFixed(0)}%`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
