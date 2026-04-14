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
  // Применяем глоссарий к тексту
  const processText = (content: string, key: number): ReactNode => {
    if (glossaryTerms && glossaryTerms.length > 0 && content.trim()) {
      return <GlossaryText key={key} text={content} terms={glossaryTerms} />;
    }
    return content;
  };

  const parseInline = (content: string): ReactNode[] => {
    const result: ReactNode[] = [];
    let lastIndex = 0;
    const boldRegex = /\*\*([^*]+)\*\*/g;
    let match = boldRegex.exec(content);

    while (match !== null) {
      if (match.index > lastIndex) {
        result.push(processText(content.slice(lastIndex, match.index), result.length));
      }
      result.push(<strong key={result.length}>{match[1]}</strong>);
      lastIndex = match.index + match[0].length;

      match = boldRegex.exec(content);
    }

    if (lastIndex < content.length) {
      result.push(processText(content.slice(lastIndex), result.length));
    }

    return result.length > 0 ? result : [processText(content, result.length)];
  };

  const renderContent = () => {
    const lines = text.split('\n');
    const elements: ReactNode[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // eslint-disable-next-line no-continue
      if (!trimmed) continue;

      if (trimmed.startsWith('# ')) {
        elements.push(<h1 key={i}>{parseInline(trimmed.slice(2))}</h1>);
      }
      else if (trimmed.startsWith('## ')) {
        elements.push(<h2 key={i}>{parseInline(trimmed.slice(3))}</h2>);
      }
      else if (trimmed.startsWith('### ')) {
        elements.push(<h3 key={i}>{parseInline(trimmed.slice(4))}</h3>);
      }
      else if (trimmed.startsWith('> ')) {
        elements.push(<blockquote key={i}>{parseInline(trimmed.slice(2))}</blockquote>);
      }
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
      else {
        elements.push(<p key={i}>{parseInline(line)}</p>);
      }
    }

    return elements;
  };

  return <div className={styles.richTextRenderer}>{renderContent()}</div>;
};
