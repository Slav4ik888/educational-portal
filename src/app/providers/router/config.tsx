import { createBrowserRouter } from 'react-router-dom';
import { ArticlesListPage } from 'pages/articles-list-page';
import { ArticlePage } from 'pages/article-page';


export const router = createBrowserRouter([
  { path: '/', element: <ArticlesListPage /> },
  { path: '/articles/:id', element: <ArticlePage /> },
]);
