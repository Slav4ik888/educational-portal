import { createBrowserRouter } from 'react-router-dom';
import { ArticlesListPage } from 'pages/articles-list-page';
import { ArticlePage } from 'pages/article-page';
import { cfg } from '../../config';



export const router = createBrowserRouter(
  [
    { path: '/', element: <ArticlesListPage /> },
    { path: '/articles/:id', element: <ArticlePage /> },
  ],
  {
    basename: cfg.IS_DEV ? '/' : '/educational-portal' // Название репозитория должно быть таким же, как в publicPath
  }
);
