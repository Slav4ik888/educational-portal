import { createBrowserRouter } from 'react-router-dom';
import { ArticlesListPage } from 'pages/ArticlesListPage';
import { ArticlePage } from 'pages/ArticlePage';


export const router = createBrowserRouter([
  { path: '/', element: <ArticlesListPage /> },
  { path: '/articles/:id', element: <ArticlePage /> },
]);
