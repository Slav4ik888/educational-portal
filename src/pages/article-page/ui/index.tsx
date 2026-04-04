import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { StateSchema } from 'app/providers/store';
import { articleActions } from 'entities/article';
import { ArticleReader } from 'widgets/article-reader';
import { FinalTest } from 'widgets/final-test';
import { Loader } from 'shared/ui/loader';
import { mockArticles } from 'shared/mocks/article/mock-articles';
import styles from './article-page.module.scss';



/** Компонент страницы статьи */
export const ArticlePage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentArticle, isLoading } = useSelector((state: StateSchema) => state.article);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  useEffect(() => {
    // Загрузка статьи по ID
    dispatch(articleActions.setLoading(true));
    setTimeout(() => {
      const article = mockArticles.find(a => a.id === id);
      if (article) {
        dispatch(articleActions.setCurrentArticle(article));
      }
      dispatch(articleActions.setLoading(false));
    }, 300);

    return () => {
      dispatch(articleActions.setCurrentArticle(null));
    };
  }, [id, dispatch]);

  const handleBack = () => {
    navigate('/');
  };

  const handleFinalTestComplete = (score: number) => {
    setFinalScore(score);
    setIsTestCompleted(true);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!currentArticle) {
    return (
      <div className={styles.errorContainer}>
        <h2>Статья не найдена</h2>
        <button type='button' onClick={handleBack}>Вернуться к списку</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button
        type      = 'button'
        className = {styles.backButton}
        onClick   = {handleBack}
      >
        ← Назад к статьям
      </button>

      <article className={styles.article}>
        <header className={styles.header}>
          <h1>{currentArticle.title}</h1>
          <div className={styles.meta}>
            <span>📖 {currentArticle.duration} мин</span>
            <span className={styles.difficulty} data-level={currentArticle.difficulty}>
              {currentArticle.difficulty === 'beginner' && '🌱 Начинающий'}
              {currentArticle.difficulty === 'intermediate' && '📘 Средний'}
              {currentArticle.difficulty === 'advanced' && '🚀 Продвинутый'}
            </span>
            <div className={styles.tags}>
              {currentArticle.tags.map(tag => (
                <span key={tag} className={styles.tag}>#{tag}</span>
              ))}
            </div>
          </div>
        </header>

        {! isTestCompleted ? (
          <>
            <ArticleReader
              blocks    = {currentArticle.blocks}
              articleId = {currentArticle.id}
            />
            <div className={styles.finalTestSection}>
              <h2>📝 Итоговый тест</h2>
              <p>Проверьте свои знания перед завершением</p>
              <FinalTest
                questions  = {currentArticle.finalTest}
                onComplete = {handleFinalTestComplete}
              />
            </div>
          </>
        ) : (
          <div className={styles.results}>
            <div className={styles.scoreCard}>
              <h2>🎉 Поздравляем!</h2>
              <div className={styles.score}>
                {finalScore}%
              </div>
              <p>
                {finalScore && finalScore >= 80
                  ? 'Отличный результат! Вы отлично усвоили материал.'
                  : finalScore && finalScore >= 60
                  ? 'Хороший результат! Пересмотрите сложные моменты.'
                  : 'Стоит повторить материал и пройти тест снова.'}
              </p>
              <div className={styles.actions}>
                  <button
                    type      = 'button'
                    className = {styles.backToArticles}
                    onClick   = {handleBack}
                  >
                  К списку статей
                </button>
                <button
                  type      = 'button'
                  className = {styles.retakeTest}
                  onClick   = {() => {
                    setIsTestCompleted(false);
                    setFinalScore(null);
                  }}
                >
                  Пройти тест заново
                </button>
              </div>
            </div>
          </div>
        )}
      </article>
    </div>
  );
};
