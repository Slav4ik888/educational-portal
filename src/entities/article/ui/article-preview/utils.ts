import { Difficulty } from '../../types';



/** Функция для получения CSS класса сложности */
export  const getDifficultyClass = (styles: any, difficulty: Difficulty) => {
  const difficultyMap = {
    'beginner'     : styles.difficultyBeginner,
    'intermediate' : styles.difficultyIntermediate,
    'advanced'     : styles.difficultyAdvanced,
  };

  // Create a type-safe mapping that ensures the key is of the correct type
  const getMappedValue = (): typeof styles.difficultyBeginner
    | typeof styles.difficultyIntermediate
    | typeof styles.difficultyAdvanced | undefined => {
    const normalizedKey = difficulty?.toLowerCase?.();

    if (normalizedKey in difficultyMap) {
      return (difficultyMap as any)[normalizedKey];
    }
    return undefined;
  };

  return getMappedValue() || styles.difficultyDefault;
};



/** Функция для ограничения description до 3 строк */
export const truncateDescription = (text: string, maxLines = 3) => {
  if (! text) return '';

  // Примерная длина текста для 3 строк (можно настроить)
  const approximateLength = maxLines * 100;

  if (text.length <= approximateLength) return text;

  const truncated = text.slice(0, approximateLength);
  const lastSpace = truncated.lastIndexOf(' ');

  return lastSpace > 0 ? `${truncated.slice(0, lastSpace)}...` : `${truncated}...`;
};
