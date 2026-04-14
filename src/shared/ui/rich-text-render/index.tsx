/* eslint-disable no-continue */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable max-len */
import { FC, ReactNode } from 'react';
import { GlossaryTerm } from 'entities/glossary';
import { GlossaryText } from 'features/glossary';
import styles from './index.module.scss';

interface Props {
  text: string
  glossaryTerms?: GlossaryTerm[];  // Опциональные термины для глоссария
}

export const RichTextRenderer: FC<Props> = ({ text, glossaryTerms = [] }) => {
  // Применяем глоссарий к тексту (не применяем к коду и таблицам)
  const processText = (content: string, key: number): ReactNode => {
    if (glossaryTerms && glossaryTerms.length > 0 && content.trim()) {
      return <GlossaryText key={key} text={content} terms={glossaryTerms} />;
    }
    return content;
  };

  const parseInline = (content: string, skipGlossary: boolean = false): ReactNode[] => {
    const result: ReactNode[] = [];
    let lastIndex = 0;
    const boldRegex = /\*\*([^*]+)\*\*/g;
    let match = boldRegex.exec(content);

    while (match !== null) {
      if (match.index > lastIndex) {
        const textPart = content.slice(lastIndex, match.index);
        if (skipGlossary) {
          result.push(textPart);
        } else {
          result.push(processText(textPart, result.length));
        }
      }
      result.push(<strong key={result.length}>{match[1]}</strong>);
      lastIndex = match.index + match[0].length;

      match = boldRegex.exec(content);
    }

    if (lastIndex < content.length) {
      const textPart = content.slice(lastIndex);
      if (skipGlossary) {
        result.push(textPart);
      } else {
        result.push(processText(textPart, result.length));
      }
    }

    return result.length > 0 ? result : [processText(content, result.length)];
  };

  /**
   * Парсит блок кода
   * Поддерживает формат ```language \n code \n ```
   */
  const parseCodeBlock = (lines: string[], startIndex: number): { node: ReactNode; nextIndex: number } => {
    let i = startIndex;
    const codeLines: string[] = [];

    // Определяем язык (если указан)
    const firstLine = lines[i].trim();
    const language = firstLine.slice(3).trim() || 'text';

    i++; // Переходим на следующую строку после ```

    // Собираем строки кода до закрывающего ```
    while (i < lines.length && !lines[i].trim().startsWith('```')) {
      codeLines.push(lines[i]);
      i++;
    }

    // Пропускаем закрывающий ```
    if (i < lines.length && lines[i].trim().startsWith('```')) {
      i++;
    }

    const codeContent = codeLines.join('\n');

    return {
      node: (
        <pre key={`code-${startIndex}`} className={styles.codeBlock}>
          <code className={`language-${language}`}>
            {codeContent}
          </code>
        </pre>
      ),
      nextIndex: i
    };
  };

  /**
   * Парсит таблицу в Markdown формате
   * Поддерживает формат:
   * | Header1 | Header2 |
   * |---------|---------|
   * | Cell1   | Cell2   |
   */
  const parseTable = (lines: string[], startIndex: number): { node: ReactNode; nextIndex: number } => {
    let i = startIndex;
    const rows: string[][] = [];
    let headerRow: string[] = [];
    let hasHeaderSeparator = false;

    // Собираем строки таблицы
    while (i < lines.length && lines[i].trim().startsWith('|')) {
      const line = lines[i].trim();
      // Разбиваем по |, удаляем пустые элементы в начале и конце
      const cells = line.split('|').filter(cell => cell !== '').map(cell => cell.trim());

      // Проверяем, является ли строка разделителем (содержит ---)
      const isSeparator = cells.every(cell => /^[-:]+$/.test(cell));

      if (isSeparator && !hasHeaderSeparator) {
        hasHeaderSeparator = true;
        i++;
        continue;
      }

      if (!hasHeaderSeparator) {
        headerRow = cells;
      } else {
        rows.push(cells);
      }
      i++;
    }

    // Рендерим таблицу
    const renderTable = () => (
      <div key={`table-${startIndex}`} className={styles.tableWrapper}>
        <table className={styles.table}>
          {headerRow.length > 0 && (
            <thead>
              <tr>
                {headerRow.map((cell, idx) => (
                  <th key={idx}>{parseInline(cell, true)}</th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx}>{parseInline(cell, true)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    return {
      node: renderTable(),
      nextIndex: i
    };
  };

  const renderContent = () => {
    const lines = text.split('\n');
    const elements: ReactNode[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Пропускаем пустые строки
      if (!trimmed) continue;

      // Блок кода
      if (trimmed.startsWith('```')) {
        const { node, nextIndex } = parseCodeBlock(lines, i);
        elements.push(node);
        i = nextIndex - 1;
        continue;
      }

      // Таблица
      if (trimmed.startsWith('|') && trimmed.includes('|')) {
        // Проверяем, что это начало таблицы (следующая строка содержит ---)
        const nextLine = lines[i + 1]?.trim() || '';
        if (nextLine.includes('|') && nextLine.includes('-')) {
          const { node, nextIndex } = parseTable(lines, i);
          elements.push(node);
          i = nextIndex - 1;
          continue;
        }
        // Если это не таблица, обрабатываем как обычный текст
      }

      // Заголовки
      if (trimmed.startsWith('# ')) {
        elements.push(<h1 key={i}>{parseInline(trimmed.slice(2))}</h1>);
      }
      else if (trimmed.startsWith('## ')) {
        elements.push(<h2 key={i}>{parseInline(trimmed.slice(3))}</h2>);
      }
      else if (trimmed.startsWith('### ')) {
        elements.push(<h3 key={i}>{parseInline(trimmed.slice(4))}</h3>);
      }
      // Цитаты
      else if (trimmed.startsWith('> ')) {
        elements.push(<blockquote key={i}>{parseInline(trimmed.slice(2))}</blockquote>);
      }
      // Списки
      else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items: ReactNode[] = [];
        let j = i;
        while (j < lines.length && (lines[j].trim().startsWith('- ') || lines[j].trim().startsWith('* '))) {
          const itemText = lines[j].trim().slice(2);
          items.push(<li key={j}>{parseInline(itemText)}</li>);
          j++;
        }
        elements.push(<ul key={i}>{items}</ul>);
        i = j - 1;
      }
      // Обычный параграф
      else {
        elements.push(<p key={i}>{parseInline(line)}</p>);
      }
    }

    return elements;
  };

  return <div className={styles.richTextRenderer}>{renderContent()}</div>;
};
