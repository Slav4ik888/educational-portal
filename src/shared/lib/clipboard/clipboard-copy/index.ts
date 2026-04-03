import { __devLog } from '../../tests/__dev-log';

/**
 * Копирует текст в буфер обмена
 *  - navigator.clipboard работает только в безопасных контекстах (HTTPS или localhost).
 */
export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    // console.log("Текст скопирован в буфер");
  }
  catch (err) {
    __devLog('copyToClipboard', 'Ошибка записи в буфер:', err);
  }
}
