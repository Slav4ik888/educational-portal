/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable max-len */
import { FC, ReactNode } from 'react';
import { GlossaryText } from '#features/glossary/ui/glossary-text/index.js';
import { llmGlossaryTerms } from 'entities/glossary';
import styles from './index.module.scss';


interface Props {
  text: string
}


export const RichTextRenderer: FC<Props> = ({ text }) => {
  /**
   * Парсит инлайн-разметку внутри строки:
   * - **жирный текст**
   * - *курсив*
   * - `код`
   * - [ссылка](url)
   */
  const parseInlineMarkdown = (content: string): ReactNode[] => {
    if (!content) return [content]

    const result: ReactNode[] = []
    let lastIndex = 0

    // Комбинированный regex для всех типов разметки
    const combinedRegex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g
    let match

    // eslint-disable-next-line no-cond-assign
    while ((match = combinedRegex.exec(content)) !== null) {
      // Добавляем текст до матча
      if (match.index > lastIndex) {
        result.push(content.slice(lastIndex, match.index))
      }

      const matchedText = match[0]

      // Жирный текст **bold**
      if (matchedText.startsWith('**') && matchedText.endsWith('**')) {
        result.push(
          <strong key={`bold-${result.length}`}>
            {matchedText.slice(2, -2)}
          </strong>
        )
      }
      // Курсив *italic*
      else if (matchedText.startsWith('*') && matchedText.endsWith('*') && !matchedText.startsWith('**')) {
        result.push(
          <em key={`italic-${result.length}`}>
            {matchedText.slice(1, -1)}
          </em>
        )
      }
      // Код `code`
      else if (matchedText.startsWith('`') && matchedText.endsWith('`')) {
        result.push(
          <code key={`code-${result.length}`}>
            {matchedText.slice(1, -1)}
          </code>
        )
      }
      // Ссылка [text](url)
      else if (matchedText.startsWith('[')) {
        const linkMatch = matchedText.match(/\[([^\]]+)\]\(([^)]+)\)/)
        if (linkMatch) {
          result.push(
            <a
              key={`link-${result.length}`}
              href={linkMatch[2]}
              target='_blank'
              rel='noopener noreferrer'
            >
              {linkMatch[1]}
            </a>
          )
        }
      }

      lastIndex = match.index + matchedText.length
    }

    // Добавляем оставшийся текст
    if (lastIndex < content.length) {
      result.push(content.slice(lastIndex))
    }

    return result.length > 0 ? result : [content]
  }

  /**
   * Рендерит блок контента
   */
  const renderContent = (): ReactNode => {
    const lines = text.split('\n')
    const elements: ReactNode[] = []
    let i = 0

    while (i < lines.length) {
      const line = lines[i]
      const trimmedLine = line.trim()

      // Пустая строка
      if (!trimmedLine) {
        elements.push(<br key={`br-${i}`} />)
        i++
      }
      // Заголовок h1 (# )
      else if (trimmedLine.startsWith('# ')) {
        elements.push(
          <h1 key={`h1-${i}`} className={styles.richTextH1}>
            {parseInlineMarkdown(trimmedLine.slice(2))}
          </h1>
        )
        i++
      }
      // Заголовок h2 (## )
      else if (trimmedLine.startsWith('## ')) {
        elements.push(
          <h2 key={`h2-${i}`} className={styles.richTextH2}>
            {parseInlineMarkdown(trimmedLine.slice(3))}
          </h2>
        )
        i++
      }
      // Заголовок h3 (### )
      else if (trimmedLine.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${i}`} className={styles.richTextH3}>
            {parseInlineMarkdown(trimmedLine.slice(4))}
          </h3>
        )
        i++
      }
      // Заголовок h4 (#### )
      else if (trimmedLine.startsWith('#### ')) {
        elements.push(
          <h4 key={`h4-${i}`} className={styles.richTextH4}>
            {parseInlineMarkdown(trimmedLine.slice(5))}
          </h4>
        )
        i++
      }
      // Цитата (> )
      else if (trimmedLine.startsWith('> ')) {
        elements.push(
          <blockquote key={`quote-${i}`} className={styles.richTextQuote}>
            {parseInlineMarkdown(trimmedLine.slice(2))}
          </blockquote>
        )
        i++
      }
      // Горизонтальный разделитель (---, ***, ___)
      else if (/^---$|^\*\*\*$|^___$/.test(trimmedLine)) {
        elements.push(<hr key={`hr-${i}`} className={styles.richTextHr} />)
        i++
      }
      // Маркированный список (- или *)
      else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        const listItems: ReactNode[] = []

        while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
          const itemContent = lines[i].trim().slice(2)
          listItems.push(
            <li key={`li-${i}`}>
              {parseInlineMarkdown(itemContent)}
            </li>
          )
          i++
        }

        elements.push(
          <ul key={`ul-${i}`} className={styles.richTextUl}>
            {listItems}
          </ul>
        )
      }
      // Нумерованный список (1., 2., etc)
      else if (/^\d+\.\s/.test(trimmedLine)) {
        const listItems: ReactNode[] = []

        while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
          const itemContent = lines[i].trim().replace(/^\d+\.\s/, '')
          listItems.push(
            <li key={`li-${i}`}>
              {parseInlineMarkdown(itemContent)}
            </li>
          )
          i++
        }

        elements.push(
          <ol key={`ol-${i}`} className={styles.richTextOl}>
            {listItems}
          </ol>
        )
      }
      // Обычный параграф
      else {
        elements.push(
          <p key={`p-${i}`} className={styles.richTextParagraph}>
            {parseInlineMarkdown(line)}
          </p>
        )
        i++
      }
    }

    return elements
  }

  return (
    <div className={styles.richTextRenderer}>
      {renderContent()}
    </div>
  )
}
