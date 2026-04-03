import { __devLog } from '../../tests/__dev-log';

/**
 * Копирует текст в буфер обмена
 *  - navigator.clipboard работает только в безопасных контекстах (HTTPS или localhost).
 */
export async function getClipboardText() {
  try {
    const text = await navigator.clipboard.readText();
    // console.log("Текст из буфера:", text);
    return text;
  }
  catch (err) {
    __devLog('getClipboardText', 'Ошибка чтения буфера:', err);
    return '';
  }
}

// Использование
// getClipboardText().then(text => {
//   console.log("Использование текста:", text);
// });
