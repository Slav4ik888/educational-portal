import { RoutePath } from 'app/providers/routes';
import { NO_SHEET_ID } from 'entities/dashboard-view';
import { useLocation } from 'react-router-dom';
import { isDashboardPage as isDashboardPageFunc } from './utils';



export const usePages = () => {
  const { pathname }    = useLocation();
  const isDashboardPage = isDashboardPageFunc(pathname);
  const isLoginPage     = pathname === RoutePath.LOGIN;
  const isSignupPage    = pathname === RoutePath.SIGNUP;

  const dashboardSheetId = isDashboardPage
    ? pathname.split('/')[3] || NO_SHEET_ID // 'main' // '/{companyId}/dashboard/{pageId}'
    : undefined;

  const isDashboardSheetMain = dashboardSheetId === NO_SHEET_ID; // 'main';


  return {
    isDashboardPage,
    isLoginPage,
    isSignupPage,

    dashboardSheetId,
    isDashboardSheetMain,
  }
}
