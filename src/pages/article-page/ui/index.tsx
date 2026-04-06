import { FC, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { StateSchema } from 'app/providers/store';
import { articleActions } from 'entities/article';
import { ArticleReader } from 'widgets/article-reader';
import { Loader } from 'shared/ui/loader';
import { mockArticles } from 'shared/mocks/article/mock-articles';
import styles from './article-page.module.scss';



/** Компонент страницы статьи */
export const ArticlePage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentArticle, isLoading } = useSelector((state: StateSchema) => state.article);

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

        <ArticleReader
          blocks={currentArticle.blocks}
          finalTest={currentArticle.finalTest}
          articleId={currentArticle.id}
        />
      </article>
    </div>
  );
};
