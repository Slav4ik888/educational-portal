import { createBrowserRouter } from 'react-router-dom';
import { ArticlesListPage } from 'pages/articles-list-page';
import { ArticlePage } from 'pages/article-page';
import { JourneyNewPage } from 'pages/journey-new-page';
import { JourneyPage } from 'pages/journey-page';
import { JourneyReportPage } from 'pages/journey-report-page';
import { ProgressPage } from 'pages/progress-page';
import { SearchPage } from 'pages/search-page';



export const router = createBrowserRouter(
  [
    { path: '/',                         element: <ArticlesListPage /> },
    { path: '/articles/:id',             element: <ArticlePage /> },
    { path: '/journey/new',              element: <JourneyNewPage /> },
    { path: '/journey/:id',              element: <JourneyPage /> },
    { path: '/journey/:id/report',       element: <JourneyReportPage /> },
    { path: '/progress',                 element: <ProgressPage /> },
    { path: '/search',                   element: <SearchPage /> },
  ]
);
