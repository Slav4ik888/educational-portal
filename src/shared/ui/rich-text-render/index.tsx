import { FC, ReactNode } from 'react';



interface RichTextRendererProps {
  text: string
}

export const RichTextRenderer: FC<RichTextRendererProps> = ({ text }) => {
  const parseInlineMarkdown = (content: string): ReactNode[] => {
    const result: ReactNode[] = [];
    const remaining = content;
    let lastIndex = 0;

    const boldRegex = /\*\*([^*]+)\*\*/g;
    let match;

    match = boldRegex.exec(remaining);
    while (match !== null) {
      if (match.index > lastIndex) {
        result.push(remaining.slice(lastIndex, match.index));
      }

      result.push(<strong key={result.length}>{match[1]}</strong>);
      lastIndex = match.index + match[0].length;
      match = boldRegex.exec(remaining);
    }

    // Добавляем оставшийся текст
    if (lastIndex < remaining.length) {
      result.push(remaining.slice(lastIndex));
    }

    return result.length > 0 ? result : [content];
  };

  return (
    <>
      {text.split('\n').map((paragraph, index) => (
        <p key={index}>{parseInlineMarkdown(paragraph)}</p>
      ))}
    </>
  );
};
