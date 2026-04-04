import { isStr } from '../../validators';
import { setStorageData, getStorageData, removeStorageData } from './main';



/** Auth */
export const setAcceptedCookie = () => setStorageData('acceptedCookie', { isAccepted: 'true' });
export const getAcceptedCookie = (): string => getStorageData<{ isAccepted: string }>(
  'acceptedCookie'
)?.isAccepted || 'false';

// Hints
export const getHintsDontShowAgain = (): string[] => getStorageData<string[]>('hintsDontShowAgain') || [];
export const setHintsDontShowAgain = (currentHintId: string | string[]) => setStorageData(
  'hintsDontShowAgain',
  isStr(currentHintId)
    ? [...getHintsDontShowAgain(), currentHintId]
    : [...currentHintId as string[]] // Если передали массив
);

// Company
export const setLastCompanyId = (companyId: string) => setStorageData('lastCompanyId', { companyId });
export const getLastCompanyId = () => getStorageData<{ companyId: string }>('lastCompanyId')?.companyId;
