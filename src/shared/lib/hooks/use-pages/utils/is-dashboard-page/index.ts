import { RouteName } from 'app/providers/routes';


/**
 * Является ли эта страница 'dashboard'?
 * @param route
 */
export const isDashboardPage = (pathname: string | undefined): boolean => {
  const route = pathname?.split('/')?.slice(1);

  return route?.[1] === RouteName.DASHBOARD;
};
