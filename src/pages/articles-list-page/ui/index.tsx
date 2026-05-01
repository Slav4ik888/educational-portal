import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { StateSchema } from 'app/providers/store';
import { ArticlePreview } from 'entities/article';
import styles from './articles-list-page.module.scss';



/** Компонент списка статей */
export const ArticlesListPage: FC = () => {
  const navigate = useNavigate();
  const { articles } = useSelector((state: StateSchema) => state.article);

  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase())
      || article.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || article.difficulty === difficultyFilter;
    const matchesTag = tagFilter === 'all' || article.tags.includes(tagFilter);

    return matchesSearch && matchesDifficulty && matchesTag;
  });

  const handleArticleClick = (articleId: string) => {
    navigate(`/articles/${articleId}`);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Образовательный портал</h1>
        <p>Выберите статью для изучения</p>
        <button
          type    = 'button'
          onClick = {() => navigate('/journey/new')}
          style   = {{
            marginTop     : 16,
            padding       : '12px 28px',
            background    : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border        : 'none',
            borderRadius  : 12,
            color         : '#fff',
            fontSize      : 15,
            fontWeight    : 700,
            cursor        : 'pointer',
            letterSpacing : '0.3px',
          }}
        >
          ✨ Создать Knowledge Journey
        </button>
      </header>

      {articles.length > 0 && (
        <>
          <div className={styles.stats}>
            Найдено статей: {filteredArticles.length}
          </div>

          <div className={styles.articlesGrid}>
            {filteredArticles.map(article => (
              <ArticlePreview
                key     = {article.id}
                article = {article}
                onClick = {(id) => handleArticleClick(id)}
              />
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className={styles.emptyState}>
              <p>Статьи не найдены</p>
              <button
                type    = 'button'
                onClick = {() => {
                  setSearchTerm('');
                  setDifficultyFilter('all');
                  setTagFilter('all');
                }}
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
