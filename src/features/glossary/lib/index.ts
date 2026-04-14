import { GlossaryTerm } from 'entities/glossary';


/**
 * Экранирует HTML спецсимволы
 */
const escapeHtml = (str: string): string => str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/**
 * Подсвечивает термины в тексте, игнорируя уже обработанные участки
 */
export const highlightTerms = (text: string, terms: GlossaryTerm[]): string => {
  if (!terms.length || !text) return text;

  // Сортируем по длине (сначала самые длинные)
  const sortedTerms = [...terms].sort((a, b) => b.term.length - a.term.length);

  // Создаем регулярное выражение для поиска всех терминов
  const allTerms = sortedTerms.flatMap(term => [term.term, ...(term.aliases || [])]);
  const pattern = new RegExp(`\\b(${allTerms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi');

  // Заменяем, но только если текст не внутри уже существующего тега
  let result = '';
  let lastIndex = 0;
  let match;

  // Сбросим lastIndex у regex
  pattern.lastIndex = 0;

  // eslint-disable-next-line no-cond-assign
  while ((match = pattern.exec(text)) !== null) {
    // Добавляем текст до совпадения
    result += text.slice(lastIndex, match.index);

    const matchedWord = match[0];

    // Находим термин для этого совпадения
    const foundTerm = sortedTerms.find(term =>
      term.term.toLowerCase() === matchedWord.toLowerCase()
      || term.aliases?.some(alias => alias.toLowerCase() === matchedWord.toLowerCase())
    );

    if (foundTerm) {
      const safeTerm = escapeHtml(foundTerm.term);
      const safeDefinition = escapeHtml(foundTerm.definition);
      // eslint-disable-next-line max-len
      result += `<span class="glossary-term" data-term="${safeTerm}" data-definition="${safeDefinition}">${escapeHtml(matchedWord)}</span>`;
    }
    else {
      result += escapeHtml(matchedWord);
    }

    lastIndex = match.index + matchedWord.length;
  }

  // Добавляем остаток текста
  result += text.slice(lastIndex);

  return result;
};
