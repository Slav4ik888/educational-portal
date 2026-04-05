import { FC } from 'react';
import { Article } from '../../types';
import { truncateDescription, getDifficultyClass } from './utils';
import styles from './article-preview.module.scss';



interface Props {
  article: Article
  onClick: (id: string) => void;
}

export const ArticlePreview: FC<Props> = ({ article, onClick }) => (
  <button
    type      = 'button'
    className = {styles.articlePreview}
    onClick   = {() => onClick(article.id)}
  >
    {article.coverImage && (
      <div className={styles.coverImageContainer}>
        <img
          src       = {article.coverImage}
          alt       = {article.title}
          className = {styles.coverImage}
        />
      </div>
    )}

    <div className={styles.content}>
      <h3 className={styles.title}>{article.title}</h3>

      {article.description && (
        <p className={styles.description}>
          {truncateDescription(article.description)}
        </p>
      )}

      {article.tags && article.tags.length > 0 && (
        <div className={styles.tagsContainer}>
          {article.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className={styles.metadata}>
        {article.difficulty && (
          <span className={`${styles.difficulty} ${getDifficultyClass(styles, article.difficulty)}`}>
            📊 {article.difficulty}
          </span>
        )}

        {article.duration && (
          <span className={styles.duration}>
            ⏱️ {article.duration} мин
          </span>
        )}
      </div>
    </div>
  </button>
);
