
/**
 * Выводит сообщение в консоль, если не продакшен.
 *  flag '--force' чтобы показать в production
 * @param funcName - имя функции. Если не нужно выводит имя ф-ции тогда args должен отсутствовать
 * @param args - аргументы для вывода
 * Варианты использования:
 *  devLog('Лог только в development'); // Не покажется в production
 *  devLog('Важное сообщение', '--force'); // Покажется даже в production
 */
export function __devLog(funcName: any, ...args: any[]): void {
  // const isProduction = process.env.NODE_ENV === 'production';
  const hasForceFlag = args.includes('--force');

  if (__IS_DEV__ || hasForceFlag) {
    // Фильтруем аргументы, исключая флаг '--force'
    const filteredArgs = args.filter(arg => arg !== '--force');
    if (args) {
      // eslint-disable-next-line no-console
      console.log(`[${funcName}]`, ...filteredArgs);
    }
    else {
      // eslint-disable-next-line no-console
      console.log(funcName);
    }
  }
}
