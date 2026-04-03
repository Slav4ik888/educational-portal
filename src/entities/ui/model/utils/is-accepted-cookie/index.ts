import { LS } from 'shared/lib/local-storage';

/**
 * Check, is accept cookie - читаем, принимали ли cookie
 */
export const isAcceptCookie = () => LS.getAcceptedCookie() === 'true';
