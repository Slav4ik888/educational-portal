import { PREFIX } from '../main';
import * as h from '../helpers';

export const clearStorage = () => {
  // Сохраняем то, что не должно исчезнуть
  const cookie             = h.getAcceptedCookie();
  const partnerId          = h.getPartnerId();
  const hintsDontShowAgain = h.getHintsDontShowAgain();

  // Очищаем localStorage
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(PREFIX)) {
      localStorage.removeItem(key);
    }
  });

  // Восстанавливаем сохранённое
  if (cookie) h.setAcceptedCookie();
  if (partnerId) h.setPartnerId(partnerId);
  h.setHintsDontShowAgain(hintsDontShowAgain);

  // window.dispatchEvent(new Event('storageCleared'));
};
