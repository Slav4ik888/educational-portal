import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { StateSchema } from 'app/providers/store';
import { articleActions, ArticlePreview } from 'entities/article';
import { mockArticles } from 'shared/mocks/article/mock-articles';
import { Loader } from 'shared/ui/loader';
// import { SearchBar } from 'features/searchArticle';
// import { FilterBar } from 'features/filterArticles';
import styles from './articles-list-page.module.scss';



/** Компонент списка статей */
export const ArticlesListPage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { articles, isLoading } = useSelector((state: StateSchema) => state.article);

  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');

  useEffect(() => {
    // Имитация загрузки с сервера
    dispatch(articleActions.setLoading(true));
    setTimeout(() => {
      dispatch(articleActions.setArticles(mockArticles));
      dispatch(articleActions.setLoading(false));
    }, 500);
  },
    [dispatch]
  );

  // Фильтрация статей
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase())
      || article.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || article.difficulty === difficultyFilter;
    const matchesTag = tagFilter === 'all' || article.tags.includes(tagFilter);

    return matchesSearch && matchesDifficulty && matchesTag;
  });

  // Получение уникальных тегов
  const allTags = ['all', ...Array.from(new Set(articles.flatMap(a => a.tags)))];

  const handleArticleClick = (articleId: string) => {
    navigate(`/articles/${articleId}`);
  };

  if (isLoading) {
    return <Loader />;
  }

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

      {/* <div className={styles.controls}>
        <SearchBar
          searchTerm     = {searchTerm}
          onSearchChange = {setSearchTerm}
        />
        <FilterBar
          difficultyFilter   = {difficultyFilter}
          onDifficultyChange = {setDifficultyFilter}
          tagFilter          = {tagFilter}
          onTagChange        = {setTagFilter}
          tags               = {allTags}
        />
      </div> */}

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
    </div>
  );
};
