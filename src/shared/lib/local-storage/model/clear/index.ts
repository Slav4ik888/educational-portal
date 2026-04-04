import { PREFIX } from '../main';
import * as h from '../helpers';

export const clearStorage = () => {
  // Сохраняем то, что не должно исчезнуть
  const cookie             = h.getAcceptedCookie();

  // Очищаем localStorage
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(PREFIX)) {
      localStorage.removeItem(key);
    }
  });

  // Восстанавливаем сохранённое
  if (cookie) h.setAcceptedCookie();

  // window.dispatchEvent(new Event('storageCleared'));
};
