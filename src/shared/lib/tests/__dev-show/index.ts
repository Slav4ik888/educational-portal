import { __devLog } from '../__dev-log';

/**
 * v.2025-03-21
 * Выводит сообщение только для маркированных данных.
 *   - Используется в ситуациях когда выводится список подобных компонентов,
 *     но нам нужно чтобы в консоль выводилось не всё, а только маркированные
 */
export const __devShow = (
  mark      : string, // метка с которой сравнивают
  markValue : string | undefined, // переданное значение
  label     : string, // Текстовая метка
  value?    : any
) => {
  if (mark === markValue) {
    if (value !== undefined) {
      __devLog('__devShow', `[${label}]:`, value);
    }
    else {
      __devLog('__devShow', label);
    }
  }
};

// const __consoleConstructor = () => (label: string, value?: string) => ___devShow('pointBackgroundColor', devValue, label, value);
// const __console = __consoleConstructor();
