import { FC, useEffect } from 'react';
import { highlightTerms } from '../../lib';
import { GlossaryTerm } from 'entities/glossary';
// import styles from './index.module.scss';



interface Props {
  text  : string  // Текст теоретического блока
  terms : GlossaryTerm[]
}

/** Компонент GlossaryText (обертка для текста с подсветкой терминов) */
export const GlossaryText: FC<Props> = ({
  text,
  terms,
}) => {
  // Применяем подсветку только к чистому тексту
  const html = highlightTerms(text, terms);

  useEffect(() => {
    let currentTooltip: HTMLDivElement | null = null;

    const showTooltip = (event: MouseEvent, termElement: HTMLElement) => {
      const term = termElement.getAttribute('data-term') || '';
      const definition = termElement.getAttribute('data-definition') || '';

      // Удаляем старый тултип
      if (currentTooltip) {
        currentTooltip.remove();
        currentTooltip = null;
      }

      // Создаем тултип
      const tooltip = document.createElement('div');
      tooltip.className = 'glossary-tooltip';

      // Добавляем заголовок и содержимое
      const titleSpan = document.createElement('div');
      titleSpan.className = 'glossary-tooltip-title';
      titleSpan.textContent = term;

      const contentSpan = document.createElement('div');
      contentSpan.className = 'glossary-tooltip-content';
      contentSpan.textContent = definition;

      tooltip.appendChild(titleSpan);
      tooltip.appendChild(contentSpan);

      document.body.appendChild(tooltip);
      currentTooltip = tooltip;

      // Позиционируем тултип
      positionTooltip(event, tooltip);
    };

    const positionTooltip = (event: MouseEvent, tooltip: HTMLDivElement) => {
      const rect = tooltip.getBoundingClientRect();
      let left = event.clientX + 15;
      let top = event.clientY - rect.height - 10;

      // Корректируем если выходит за правый край
      if (left + rect.width > window.innerWidth - 10) {
        left = event.clientX - rect.width - 15;
      }

      // Корректируем если выходит за левый край
      if (left < 10) {
        left = 10;
      }

      // Корректируем если выходит за верхний край
      if (top < 10) {
        top = event.clientY + 25;
      }

      // Корректируем если выходит за нижний край
      if (top + rect.height > window.innerHeight - 10) {
        top = event.clientY - rect.height - 10;
      }

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    };

    const hideTooltip = () => {
      if (currentTooltip) {
        currentTooltip.remove();
        currentTooltip = null;
      }
    };

    const handleMouseEnter = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const termElement = target.closest('.glossary-term');

      if (termElement && termElement instanceof HTMLElement) {
        showTooltip(event, termElement);
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (currentTooltip) {
        positionTooltip(event, currentTooltip);
      }
    };

    const handleMouseLeave = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const termElement = target.closest('.glossary-term');

      if (!termElement || !(termElement instanceof HTMLElement)) {
        hideTooltip();
      }
    };

    // Навешиваем обработчики на весь документ
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseout', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseout', handleMouseLeave);
      hideTooltip();
    };
  }, [html]);

  return <span dangerouslySetInnerHTML={{ __html: html }} />;
};
