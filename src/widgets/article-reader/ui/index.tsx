import { FC, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StateSchema } from 'app/providers/store';
import { userProgressActions } from 'entities/user-progress';
import { TestQuestion, isFinalCompleted, isTestCompleted } from 'entities/test-block';
import { TestBlock } from 'widgets/test-block';
import { ContentBlockType, TheoryBlock } from 'entities/article';
import { decrementString } from '../utils';
import { Congratulation } from './congratulation';
import styles from './article-reader.module.scss';



interface Props {
  blocks          : ContentBlockType[]
  finalTest?      : TestQuestion[]
  enableGlossary? : boolean
  articleId       : string
}

export const ArticleReader: FC<Props> = ({
  blocks,
  finalTest = [],
  articleId
}) => {
  const dispatch = useDispatch();
  const [completedBlocks, setCompletedBlocks] = useState<Set<string>>(new Set());
  const [testResults, setTestResults] = useState<Record<string, number>>({});
  const [finalTestSubmitted, setFinalTestSubmitted] = useState(false);
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


  const handleTestComplete = (blockId: string, score: number) => {
    const isCompleted = isTestCompleted(score);

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
    const isCompleted = isFinalCompleted(score);

    setFinalTestCompleted(isCompleted);
    setFinalTestScore(score);
    setFinalTestSubmitted(true);

    dispatch(userProgressActions.updateFinalTestProgress({
      articleId,
      completed: isCompleted,
      score,
    }));
  };

  const allBlocksCompleted = blocks.length === completedBlocks.size;
  const hasFinalTest = finalTest.length > 0;
  // const isArticleCompleted = finalTestCompleted && allBlocksCompleted;


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
          if (block.type === 'test' && isCompleted) return null

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
                  <TheoryBlock content={block.content} />
                )}

                {block.type === 'test' && block.questions && (
                  <TestBlock
                    type        = 'inline'
                    questions   = {block.questions}
                    isCompleted = {isCompleted}
                    savedScore  = {testResults[block.id]}
                    onComplete  = {(score: number) => handleTestComplete(block.id, score)}
                  />
                )}
              </div>
            </div>
          );
        })}

        {/* Итоговый тест появляется после прохождения всех блоков */}
        {hasFinalTest && allBlocksCompleted && (
          <div className={`${styles.block} ${styles.finalTestBlock}`}>
            <div className={styles.blockContent}>
              <div className={styles.finalTest}>
                {! finalTestCompleted && (
                  <div className={styles.testDescription}>
                    <p>Итоговый тест состоит из {finalTest.length} вопросов.
                    Для успешного завершения необходимо набрать не менее 70%.</p>
                  </div>
                )}
                <TestBlock
                  type        = 'final'
                  questions   = {finalTest}
                  isCompleted = {finalTestCompleted}
                  savedScore  = {finalTestScore}
                  onComplete  = {handleFinalTestComplete}
                />
              </div>
            </div>
          </div>
        )}

        {/* Поздравление с завершением */}
        {finalTestSubmitted && (
          <Congratulation
            finalTestCompleted = {finalTestCompleted}
            finalTestScore     = {finalTestScore}
          />
        )}
      </div>
    </div>
  );
};
